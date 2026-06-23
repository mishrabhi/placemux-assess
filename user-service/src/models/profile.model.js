import mongoose from "mongoose";

const selectedSkillSchema = new mongoose.Schema(
  {
    skillId: {
      type: String,
      required: true,
    },

    skillName: {
      type: String,
      required: true,
      trim: true
    },

    selectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
    },

    phone: {
      type: String,
      trim: true
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    resumeUrl: {
      type: String,
      default: null,
      trim: true
    },

    selectedSkills: [selectedSkillSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Profile", profileSchema);
