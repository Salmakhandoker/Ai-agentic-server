import mongoose from 'mongoose';
import { config } from './environment';

let connected = false;
export let isConnectedToMongo = false;

export const isDBConnected = () => connected;

export const connectDB = async () => {
  const mongoUri = config.mongoUri;

  if (!mongoUri) {
    console.warn('------------------------------------------------------------');
    console.warn('Neither MONGO_DB_URI nor MONGO_URI is set in environment variables.');
    console.warn('Aetheria Server will automatically fall back to Local Memory DB Mode.');
    console.warn('------------------------------------------------------------');
    connected = false;
    isConnectedToMongo = false;
    return;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    connected = true;
    isConnectedToMongo = true;
    console.log('MongoDB Connected Successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('------------------------------------------------------------');
    console.warn('MongoDB Atlas connection failed:', message);
    console.warn('Aetheria Server will automatically fall back to Local Memory DB Mode.');
    console.warn('All application features (auth, listings, details, reviews, and AI features) remain fully functional.');
    console.warn('------------------------------------------------------------');
    connected = false;
    isConnectedToMongo = false;
  }

  // Keep the flag in sync if the connection drops or recovers later
  mongoose.connection.on('disconnected', () => {
    connected = false;
    isConnectedToMongo = false;
    console.warn('MongoDB disconnected. Falling back to Local Memory DB Mode.');
  });

  mongoose.connection.on('reconnected', () => {
    connected = true;
    isConnectedToMongo = true;
    console.log('MongoDB reconnected.');
  });
};