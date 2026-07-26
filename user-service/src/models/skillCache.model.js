import mongoose from "mongoose";

const skillCacheSchema = new mongoose.Schema(
  {
    skillId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SkillCache", skillCacheSchema);
