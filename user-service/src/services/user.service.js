import Profile from "../models/profile.model.js";
import ApiError from "../utils/ApiError.js";
import SkillCache from "../models/skillCache.model.js";

class UserService {
  //Get User Profile
  async getProfile(userId) {
    let profile = await Profile.findOne({
      userId,
    });

    if (!profile) {
      profile = await Profile.create({
        userId,
      });
    }

    return profile;
  }

  // Update User Profile
  async updateProfile(userId, payload) {
    const { phone, yearsOfExperience, resumeUrl } = payload;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        phone,
        yearsOfExperience,
        resumeUrl,
      },
      {
        new: true,
        upsert: true,
      },
    );

    return profile;
  }

  // Add User Skills
  async addSkills(userId, skills) {
    const profile = await Profile.findOne({
      userId,
    });

    if (!profile) {
      throw new ApiError(404, "Profile not found");
    }

    // skills is expected to be array of objects { skillId, skillName }
    const skillIds = skills.map((s) => s.skillId);

    const found = await SkillCache.find({ skillId: { $in: skillIds }, isActive: true });

    if (found.length !== skillIds.length) {
      const foundIds = new Set(found.map((f) => f.skillId));
      const missing = skillIds.filter((id) => !foundIds.has(id));
      throw new ApiError(400, `Invalid skillIds: ${missing.join(",")}`);
    }

    // build canonical selectedSkills from cache
    profile.selectedSkills = found.map((skill) => ({
      skillId: skill.skillId,
      skillName: skill.name,
      selectedAt: new Date(),
    }));

    await profile.save();

    return profile;
  }

  // return available skills from local cache
  async getAvailableSkills() {
    return await SkillCache.find({ isActive: true }).select("skillId name category");
  }
}

export default new UserService();
