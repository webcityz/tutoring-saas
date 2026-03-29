import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    logger.info("MongoDB connected");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    logger.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
