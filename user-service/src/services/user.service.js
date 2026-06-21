import Profile from "../models/profile.model.js";
import ApiError from "../utils/ApiError.js";

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
    const profile = await Profile.findOneAndUpdate(
      {
        userId,
      },
      payload,
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

    profile.selectedSkills = skills.map((skill) => ({
      ...skill,
      selectedAt: new Date(),
    }));

    await profile.save();

    return profile;
  }
}

export default new UserService();
