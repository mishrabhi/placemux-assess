import SkillCache from "../models/skillCache.model.js";
import { connectQueue, consumeQueue } from "../utils/messageQueue.js";

export const startSkillConsumer = async () => {
  if (!process.env.RABBITMQ_URL) {
    console.log("RABBITMQ_URL not set — skill consumer disabled");
    return;
  }

  await connectQueue();

  await consumeQueue("skill.created", async (data) => {
    try {
      const { skillId, name, category } = data;

      await SkillCache.findOneAndUpdate(
        { skillId },
        { skillId, name, category, isActive: true },
        { upsert: true, new: true },
      );

      console.log(`SkillCache upserted: ${skillId} / ${name}`);
    } catch (err) {
      console.error("Failed to upsert skill cache:", err.message);
    }
  });
};

export default startSkillConsumer;
