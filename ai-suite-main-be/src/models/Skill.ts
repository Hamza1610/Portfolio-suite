import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level: number;
  category: string;
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, required: true },
    icon: { type: String },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISkill>('Skill', SkillSchema); 