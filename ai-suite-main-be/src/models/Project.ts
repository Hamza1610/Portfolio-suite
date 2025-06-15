import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    technologies: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['completed', 'in-progress', 'planned'], required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema); 