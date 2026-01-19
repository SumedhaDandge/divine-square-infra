// src/config/db.js
import { connect } from 'mongoose';
import { config } from 'dotenv';
import { logger } from "../utils/looger.js";



const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await connect(mongoURI, {});
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error('MongoDB connection error: ' + err.message);
    process.exit(1);
  }
};


export default connectDB;
