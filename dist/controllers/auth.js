"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataService_1 = require("../services/dataService");
const environment_1 = require("../config/environment");
exports.authRouter = (0, express_1.Router)();
const JWT_SECRET = environment_1.config.jwtSecret;
// Auth Middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
// Register Route
exports.authRouter.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }
        const existingUser = await dataService_1.DataService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await dataService_1.DataService.createUser({
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
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profile: newUser.profile
            }
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
// Login Route
exports.authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await dataService_1.DataService.findUserByEmail(email);
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});
// Google Sign-in Route
exports.authRouter.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'Google credential token is required' });
        }
        // Call Google's tokeninfo API to securely verify the ID Token
        const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
        const googleResponse = await fetch(verifyUrl);
        if (!googleResponse.ok) {
            const errData = await googleResponse.json().catch(() => ({}));
            console.error('Google token verification failed:', errData);
            return res.status(400).json({ message: 'Invalid or expired Google credential token' });
        }
        const payload = await googleResponse.json();
        // Verify audience matches our Client ID securely
        if (payload.aud !== environment_1.config.googleClientId) {
            console.error(`Google token audience mismatch. Expected: ${environment_1.config.googleClientId}, Received: ${payload.aud}`);
            return res.status(400).json({ message: 'Unauthorized Google token audience' });
        }
        // Verify issuer is Google
        const isGoogleIssuer = ['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss);
        if (!isGoogleIssuer) {
            console.error(`Google token issuer invalid: ${payload.iss}`);
            return res.status(400).json({ message: 'Invalid Google token issuer' });
        }
        const email = payload.email;
        const googleId = payload.sub;
        const username = payload.name || email.split('@')[0];
        if (!email) {
            return res.status(400).json({ message: 'Email not provided by Google account' });
        }
        let user = await dataService_1.DataService.findUserByEmail(email);
        if (!user) {
            user = await dataService_1.DataService.createUser({
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
        }
        else if (!user.googleId) {
            await dataService_1.DataService.updateUserGoogleId(user._id.toString(), googleId);
            user.googleId = googleId;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            }
        });
    }
    catch (error) {
        console.error('Google Auth error:', error);
        res.status(500).json({ message: 'Server error during Google auth' });
    }
});
// Get/Update User Profile Settings
exports.authRouter.get('/me', exports.authMiddleware, async (req, res) => {
    try {
        const user = await dataService_1.DataService.findUserById(req.user?.id || '');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Remove password
        const userObj = JSON.parse(JSON.stringify(user));
        delete userObj.password;
        res.status(200).json(userObj);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching user details' });
    }
});
exports.authRouter.put('/profile', exports.authMiddleware, async (req, res) => {
    try {
        const { budget, interests, climate, pace } = req.body;
        const user = await dataService_1.DataService.findUserById(req.user?.id || '');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await dataService_1.DataService.updateUserProfile(user._id.toString(), {
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
    }
    catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});
