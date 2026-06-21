import mongoose from "mongoose";

const selectedSkillSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    skillName: {
      type: String,
      required: true,
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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    fullName: String,

    phone: String,

    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    resumeUrl: {
      type: String,
      default: null,
    },

    selectedSkills: [selectedSkillSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Profile", profileSchema);
