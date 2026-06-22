import Skill from "../models/skill.model.js";
import ApiError from "../utils/ApiError.js";

class SkillService {
//Create skill
  async createSkill(payload) {
    const exists = await Skill.findOne({
      name: payload.name,
    });

    if (exists) {
      throw new ApiError(409, "Skill already exists");
    }

    return await Skill.create(payload);
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
