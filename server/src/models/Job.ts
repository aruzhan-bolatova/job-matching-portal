// server/src/models/Job.ts:  Interface representing a Job document in the database.

import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'open' | 'closed';
  postedBy: mongoose.Types.ObjectId;
  applications: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: [{
      type: String,
      required: [true, 'At least one requirement is needed'],
    }],
    location: {
      type: String,
      required: [true, 'Job location is required'],
    },
    salary: {
      min: {
        type: Number,
        required: [true, 'Minimum salary is required'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum salary is required'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: [true, 'Job type is required'],
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applications: [{
      type: Schema.Types.ObjectId,
      ref: 'Application',
    }],
    isDeleted: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);