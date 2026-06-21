import app from "./app.js";
import connectDB from "./src/config/db.js";
import { env } from "./src/config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`User Service running on ${env.port}`);
    });
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};

startServer();
