import mongoose from "mongoose";
import generateEvaluationId from "../utils/generateEvaluationId.js";

const scoreSchema = new mongoose.Schema(
  {
    obtained: {
      type: Number,
      default: 0,
    },

    maximum: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const evaluationSchema = new mongoose.Schema(
  {
    evaluationId: {
      type: String,
      default: generateEvaluationId,
      unique: true,
      index: true,
    },

    assessmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    candidateId: {
      type: String,
      required: true,
      index: true,
    },

    scores: {
      mcq: {
        type: scoreSchema,
        default: () => ({}),
      },

      technical: {
        type: scoreSchema,
        default: () => ({}),
      },

      coding: {
        type: scoreSchema,
        default: () => ({}),
      },
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    maxScore: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "evaluating", "completed", "failed"],
      default: "pending",
      index: true,
    },

    evaluationEngine: {
      mcq: {
        type: String,
        default: "Rule Engine",
      },

      technical: {
        type: String,
        default: "Rule Engine",
      },

      coding: {
        type: String,
        default: "Mock Engine",
      },
    },

    evaluatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

evaluationSchema.index({
  candidateId: 1,
  status: 1,
});

export default mongoose.model("Evaluation", evaluationSchema);
