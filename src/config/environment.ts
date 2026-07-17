import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_DB_URI || process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'aetheria-super-secret-jwt-key',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  isProduction: process.env.NODE_ENV === 'production',
  googleClientId: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.VITE_GOOGLE_CLIENT_SECRET || '',
};

// Validate critical variables (warn or throw if missing in production)
if (!config.mongoUri) {
  console.warn('------------------------------------------------------------');
  console.warn('WARNING: MONGO_DB_URI or MONGO_URI environment variable is not defined.');
  console.warn('------------------------------------------------------------');
}

if (config.isProduction && config.jwtSecret === 'aetheria-super-secret-jwt-key') {
  console.error('CRITICAL: Default JWT_SECRET is active in production environment!');
}
