import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  email: string;
  title: string;
  bio: string;
  location: string;
  avatar?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    avatar: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String },
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema); 