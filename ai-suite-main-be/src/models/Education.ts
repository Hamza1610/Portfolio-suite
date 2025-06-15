import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date;
  grade?: string;
  description?: string;
  logo?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema: Schema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    grade: { type: String },
    description: { type: String },
    logo: { type: String },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEducation>('Education', EducationSchema); 