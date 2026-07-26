import Skill from "../models/skill.model.js";
import ApiError from "../utils/ApiError.js";
import { publishMessage } from "../utils/messageQueue.js";

class SkillService {
//Create skill
  async createSkill(payload) {
    const exists = await Skill.findOne({
      name: payload.name,
    });

    if (exists) {
      throw new ApiError(409, "Skill already exists");
    }

    const skill = await Skill.create(payload);

    // publish skill.created event (best-effort)
    try {
      await publishMessage("skill.created", {
        skillId: skill._id.toString(),
        name: skill.name,
        category: skill.category,
      });
    } catch (err) {
      console.error("Failed to publish skill.created event:", err.message);
    }

    return skill;
  }

//get all skills
  async getAllSkills() {
    return await Skill.find({
      isActive: true,
    });
  }

//delete skills
  async deleteSkill(skillId) {
    return await Skill.findByIdAndUpdate(
      skillId,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );
  }
}

export default new SkillService();
