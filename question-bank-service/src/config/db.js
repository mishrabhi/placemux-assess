import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongoUri);

    console.log(`[db] Connected to MongoDB → ${mongoose.connection.name}`);

    mongoose.connection.on("error", (error) => {
      console.error("[db] MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[db] MongoDB disconnected");
    });
  } catch (error) {
    console.error("[db] Failed to connect:", error.message);

    process.exit(1);
  }
};

export default connectDB;
