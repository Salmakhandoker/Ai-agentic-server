"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isDBConnected = exports.isConnectedToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
let connected = false;
exports.isConnectedToMongo = false;
const isDBConnected = () => connected;
exports.isDBConnected = isDBConnected;
const connectDB = async () => {
    const mongoUri = environment_1.config.mongoUri;
    if (!mongoUri) {
        console.warn('------------------------------------------------------------');
        console.warn('Neither MONGO_DB_URI nor MONGO_URI is set in environment variables.');
        console.warn('Aetheria Server will automatically fall back to Local Memory DB Mode.');
        console.warn('------------------------------------------------------------');
        connected = false;
        exports.isConnectedToMongo = false;
        return;
    }
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose_1.default.connect(mongoUri);
        connected = true;
        exports.isConnectedToMongo = true;
        console.log('MongoDB Connected Successfully.');
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn('------------------------------------------------------------');
        console.warn('MongoDB Atlas connection failed:', message);
        console.warn('Aetheria Server will automatically fall back to Local Memory DB Mode.');
        console.warn('All application features (auth, listings, details, reviews, and AI features) remain fully functional.');
        console.warn('------------------------------------------------------------');
        connected = false;
        exports.isConnectedToMongo = false;
    }
    // Keep the flag in sync if the connection drops or recovers later
    mongoose_1.default.connection.on('disconnected', () => {
        connected = false;
        exports.isConnectedToMongo = false;
        console.warn('MongoDB disconnected. Falling back to Local Memory DB Mode.');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        connected = true;
        exports.isConnectedToMongo = true;
        console.log('MongoDB reconnected.');
    });
};
exports.connectDB = connectDB;
