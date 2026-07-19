
import express from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { connectDB } from './config/db';
import { authRouter } from './controllers/auth';
import { listingsRouter } from './controllers/listings';
import { aiRouter } from './controllers/ai';
import { isConnectedToMongo } from './config/db';

const app = express();
const PORT = config.port;

// Connect to MongoDB (start connection, but don't block app creation)
const dbConnectionPromise = connectDB();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Ensure DB connection attempt completes before handling any request
app.use(async (req, res, next) => {
  await dbConnectionPromise;
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'Aetheria Travel Agent Service',
    database: isConnectedToMongo ? 'connected' : 'disconnected',
    mongoUriProvided: !!config.mongoUri
  });
});

// Start Server (only when NOT on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;