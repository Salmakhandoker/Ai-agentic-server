import mongoose, { Schema, Document } from 'mongoose';

// User Profile interface
export interface IUserProfile {
  budget: number;
  interests: string[];
  climate: string;
  pace: string;
}

// User Document interface
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  profile: IUserProfile;
}

const UserProfileSchema = new Schema<IUserProfile>({
  budget: { type: Number, default: 3000 },
  interests: { type: [String], default: ['Adventure', 'Culture', 'Nature'] },
  climate: { type: String, default: 'Tropical' },
  pace: { type: String, default: 'Moderate' }
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  googleId: { type: String },
  profile: { type: UserProfileSchema, default: () => ({}) }
});

export const User = mongoose.model<IUser>('User', UserSchema);

// Listing Review interface
export interface IReview {
  username: string;
  rating: number;
  comment: string;
  date: Date;
}

// Listing Document interface
export interface IListing extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  date: Date;
  category: string;
  location: string;
  imageUrl: string;
  duration: number; // in days
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: number;
  ratingAverage: number;
  reviews: IReview[];
  createdBy?: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>({
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const ListingSchema = new Schema<IListing>({
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
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

export const Listing = mongoose.model<IListing>('Listing', ListingSchema);
