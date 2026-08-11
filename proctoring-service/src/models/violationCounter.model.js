import mongoose from "mongoose";

const violationCounterSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    candidateId: {
      type: String,
      required: true,
    },
    totalWarnings: {
      type: Number,
      default: 0,
    },
    totalViolations: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "warned", "barred"],
      default: "active",
    },
    lastViolationAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ViolationCounter", violationCounterSchema);
