"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("./config/environment");
const db_1 = require("./config/db");
const auth_1 = require("./controllers/auth");
const listings_1 = require("./controllers/listings");
const ai_1 = require("./controllers/ai");
const db_2 = require("./config/db");
const app = (0, express_1.default)();
const PORT = environment_1.config.port;
// Connect to MongoDB (start connection, but don't block app creation)
const dbConnectionPromise = (0, db_1.connectDB)();
// Middlewares
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use(express_1.default.json());
// Ensure DB connection attempt completes before handling any request
app.use(async (req, res, next) => {
    await dbConnectionPromise;
    next();
});
// Routes
app.use('/api/auth', auth_1.authRouter);
app.use('/api/listings', listings_1.listingsRouter);
app.use('/api/ai', ai_1.aiRouter);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'Aetheria Travel Agent Service',
        database: db_2.isConnectedToMongo ? 'connected' : 'disconnected',
        mongoUriProvided: !!environment_1.config.mongoUri
    });
});
// Start Server (only when NOT on Vercel)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
exports.default = app;
