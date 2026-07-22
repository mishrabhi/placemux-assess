import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("[db] Connected to MongoDB → assessment_db");
  } catch (error) {
    console.error("[db] MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDB;