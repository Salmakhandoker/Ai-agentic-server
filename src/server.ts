import express from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { connectDB } from './config/db';
import { authRouter } from './controllers/auth';
import { listingsRouter } from './controllers/listings';
import { aiRouter } from './controllers/ai';

const app = express();
const PORT = config.port;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for easy development and connectivity
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/ai', aiRouter);

import { isConnectedToMongo } from './config/db';

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'Aetheria Travel Agent Service',
    database: isConnectedToMongo ? 'connected' : 'disconnected',
    mongoUriProvided: !!config.mongoUri
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
