import Skill from "../models/skill.model.js";
import ApiError from "../utils/ApiError.js";
import { publishMessage } from "../utils/messageQueue.js";

class SkillService {
//Create skill
  async createSkill(payload) {
    const skills = Array.isArray(payload) ? payload : [payload];

    if (skills.length === 0) {
      throw new ApiError(400, "No skills provided");
    }

    const normalizedSkills = skills.map((skill) => ({
      name: skill.name.trim(),
      category: skill.category.trim(),
    }));

    const duplicateNames = normalizedSkills
      .map((skill) => skill.name.toLowerCase())
      .reduce((acc, name, idx, arr) => {
        if (arr.indexOf(name) !== idx && !acc.includes(name)) {
          acc.push(name);
        }
        return acc;
      }, []);

    if (duplicateNames.length) {
      throw new ApiError(
        400,
        `Duplicate skill names in request: ${duplicateNames.join(", ")}`,
      );
    }

    const existing = await Skill.find({
      name: { $in: normalizedSkills.map((skill) => skill.name) },
    });

    if (existing.length) {
      const existingNames = existing.map((skill) => skill.name).join(", ");
      throw new ApiError(409, `Skill already exists: ${existingNames}`);
    }

    const createdSkills = await Skill.create(normalizedSkills);

    try {
      await Promise.all(
        (Array.isArray(createdSkills) ? createdSkills : [createdSkills]).map(
          (skill) =>
            publishMessage("skill.created", {
              skillId: skill._id.toString(),
              name: skill.name,
              category: skill.category,
            }),
        ),
      );
    } catch (err) {
      console.error("Failed to publish skill.created event:", err.message);
    }

    return Array.isArray(payload) ? createdSkills : createdSkills[0];
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
