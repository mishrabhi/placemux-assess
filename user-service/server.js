import app from "./app.js";
import connectDB from "./src/config/db.js";
import { env } from "./src/config/env.js";
import { startSkillConsumer } from "./src/jobs/skill.consumer.js";

const startServer = async () => {
  try {
    await connectDB();

    // start skill consumer (best-effort)
    try {
      await startSkillConsumer();
    } catch (err) {
      console.error("Skill consumer failed to start:", err.message);
    }

    app.listen(env.port, () => {
      console.log(`User Service running on ${env.port}`);
    });
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};

startServer();
