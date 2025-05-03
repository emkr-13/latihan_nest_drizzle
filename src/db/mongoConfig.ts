import { connect } from 'mongoose';

export const connectMongo = async () => {
  const MONGODB_URL = process.env.MONGODB_URL;

  if (!MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined in the environment variables');
  }

  try {
    await connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};