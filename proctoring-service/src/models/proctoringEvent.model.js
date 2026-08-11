import mongoose from "mongoose";

const proctoringEventSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      index: true,
    },
    candidateId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    message: {
      type: String,
      default: "",
    },
    snapshotUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ProctoringEvent", proctoringEventSchema);
