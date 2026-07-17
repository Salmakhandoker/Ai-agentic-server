import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { authRouter } from './controllers/auth';
import { listingsRouter } from './controllers/listings';
import { aiRouter } from './controllers/ai';

// Load Env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Aetheria Travel Agent Service' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
