import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  readTime: number;
  views: number;
  likes: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String, required: true }],
    featuredImage: { type: String },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime: { type: Number, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema); 