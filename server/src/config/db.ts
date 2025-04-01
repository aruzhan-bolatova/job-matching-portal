// server/src/config/db.ts : MongoDB connection configuration
/**
 * Asynchronously connects to the MongoDB database using the provided connection URI.
 * Logs a success message upon successful connection.
 * If the connection fails, logs the error and exits the process with a non-zero status code.
 *
 * @throws Will terminate the process if the connection to MongoDB fails.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;