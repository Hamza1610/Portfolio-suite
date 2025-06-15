import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  technologies: string[];
  achievements: string[];
  companyLogo?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema = new Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, required: true },
    technologies: [{ type: String, required: true }],
    achievements: [{ type: String, required: true }],
    companyLogo: { type: String },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IExperience>('Experience', ExperienceSchema); 