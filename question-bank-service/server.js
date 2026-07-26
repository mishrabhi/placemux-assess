import app from "./app.js";

import connectDB from "./src/config/db.js";

import { env } from "./src/config/env.js";
import { connectQueue } from "./src/utils/messageQueue.js";

console.log("AI_BASE_URL =", process.env.AI_BASE_URL);

const startServer = async () => {
  try {
    await connectDB();

    await connectQueue();

    app.listen(env.port, () => {
      console.log(`Question Bank Service running on ${env.port}`);
    });
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};

startServer();
