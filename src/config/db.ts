import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

let connected = false;

export const isDBConnected = () => connected;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.warn('------------------------------------------------------------');
    console.warn('MONGO_URI is not set in environment variables.');
    console.warn('Aetheria Server will automatically fall back to Local Memory DB Mode.');
    console.warn('------------------------------------------------------------');
    connected = false;
    return;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    connected = true;
    console.log('MongoDB Connected Successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('------------------------------------------------------------');
    console.warn('MongoDB Atlas connection failed:', message);
    console.warn('Aetheria Server will automatically fall back to Local Memory DB Mode.');
    console.warn('All application features (auth, listings, details, reviews, and AI features) remain fully functional.');
    console.warn('------------------------------------------------------------');
    connected = false;
  }

  // Keep the flag in sync if the connection drops or recovers later
  mongoose.connection.on('disconnected', () => {
    connected = false;
    console.warn('MongoDB disconnected. Falling back to Local Memory DB Mode.');
  });

  mongoose.connection.on('reconnected', () => {
    connected = true;
    console.log('MongoDB reconnected.');
  });
};