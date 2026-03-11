import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  title: string;
  type: 'blog' | 'ad' | 'email' | 'product_description' | 'social_media' | 'seo' | 'script' | 'headline';
  prompt: string;
  generatedContent: string;
  aiModel: string;
  tone: string;
  language: string;
  tags: string[];
  isFavorite: boolean;
  tokensUsed: number;
  versions: {
    version: number;
    content: string;
    timestamp: Date;
    message: string;
  }[];
  seoScore?: number;
  plagiarismScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['blog', 'ad', 'email', 'product_description', 'social_media', 'seo', 'script', 'headline'],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    generatedContent: {
      type: String,
      required: true,
    },
    aiModel: {
      type: String,
      default: 'gpt-4',
    },
    tone: {
      type: String,
      default: 'professional',
    },
    language: {
      type: String,
      default: 'en',
    },
    tags: [{ type: String, trim: true }],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    versions: [
      {
        version: Number,
        content: String,
        timestamp: { type: Date, default: Date.now },
        message: String,
      },
    ],
    seoScore: Number,
    plagiarismScore: Number,
  },
  { timestamps: true }
);

// Text index for full-text search
contentSchema.index({ title: 'text', generatedContent: 'text', tags: 'text' });

export const Content = mongoose.model<IContent>('Content', contentSchema);
