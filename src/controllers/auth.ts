import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DataService } from '../services/dataService';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aetheria-super-secret-jwt-key';

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

// Auth Middleware
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; username: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Register Route
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const existingUser = await DataService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await DataService.createUser({
      username,
      email,
      password: hashedPassword,
      profile: {
        budget: 3000,
        interests: ['Adventure', 'Nature', 'Culture'],
        climate: 'Tropical',
        pace: 'Moderate'
      }
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login Route
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await DataService.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Google Sign-in Mock/Simulation Route
authRouter.post('/google', async (req: Request, res: Response) => {
  try {
    const { email, username, googleId } = req.body;
    if (!email || !username || !googleId) {
      return res.status(400).json({ message: 'Google authentication details missing' });
    }

    let user = await DataService.findUserByEmail(email);
    if (!user) {
      user = await DataService.createUser({
        username,
        email,
        googleId,
        profile: {
          budget: 3000,
          interests: ['Adventure', 'Culture', 'Beach'],
          climate: 'Temperate',
          pace: 'Moderate'
        }
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      // If we are using MongoDB, we should save. Otherwise, it is in-memory.
      // To simplify, let's update profile/settings via updates.
      await DataService.updateUserProfile(user._id.toString(), { googleId });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ message: 'Server error during Google auth' });
  }
});

// Get/Update User Profile Settings
authRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await DataService.findUserById(req.user?.id || '');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove password
    const userObj = JSON.parse(JSON.stringify(user));
    delete userObj.password;
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user details' });
  }
});

authRouter.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { budget, interests, climate, pace } = req.body;
    const user = await DataService.findUserById(req.user?.id || '');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await DataService.updateUserProfile(user._id.toString(), {
      budget,
      interests,
      climate,
      pace
    });

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update profile' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profile: updatedUser.profile
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});
