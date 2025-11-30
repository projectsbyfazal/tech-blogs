import mongoose from "mongoose";
import {MONGODB_URI} from "./config"
if (!MONGODB_URI) throw new Error("MongoDB URI missing");

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return mongoose.connect(MONGODB_URI!);
};
