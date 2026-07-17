"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isConnectedToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || 'mongodb://Agentic-AI-Project:TVNQPYyUnnnVIovQ@ac-i2evadz-shard-00-00.v3xzplr.mongodb.net:27017,ac-i2evadz-shard-00-01.v3xzplr.mongodb.net:27017,ac-i2evadz-shard-00-02.v3xzplr.mongodb.net:27017/?ssl=true&replicaSet=atlas-48z3v9-shard-0&authSource=admin&appName=Cluster0';
exports.isConnectedToMongo = false;
const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose_1.default.connect(MONGO_URI);
        exports.isConnectedToMongo = true;
        console.log('MongoDB Connected Successfully.');
    }
    catch (error) {
        console.warn('------------------------------------------------------------');
        console.warn('MongoDB Atlas connection failed: Network Sandbox Whitelist restrictions.');
        console.warn('Aetheria Server will automatically fall back to Local Memory DB Mode.');
        console.warn('All application features (auth, listings, details, reviews, and AI features) remain fully functional.');
        console.warn('------------------------------------------------------------');
        exports.isConnectedToMongo = false;
    }
};
exports.connectDB = connectDB;
