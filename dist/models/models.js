"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserProfileSchema = new mongoose_1.Schema({
    budget: { type: Number, default: 3000 },
    interests: { type: [String], default: ['Adventure', 'Culture', 'Nature'] },
    climate: { type: String, default: 'Tropical' },
    pace: { type: String, default: 'Moderate' }
});
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    googleId: { type: String },
    profile: { type: UserProfileSchema, default: () => ({}) }
});
exports.User = mongoose_1.default.model('User', UserSchema);
const ReviewSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const ListingSchema = new mongoose_1.Schema({
    title: { type: String, required: true, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    date: { type: Date, required: true, index: true },
    category: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    difficulty: { type: String, required: true, enum: ['Easy', 'Moderate', 'Challenging'] },
    groupSize: { type: Number, required: true },
    ratingAverage: { type: Number, default: 4.5, index: true },
    reviews: { type: [ReviewSchema], default: [] },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
exports.Listing = mongoose_1.default.model('Listing', ListingSchema);
