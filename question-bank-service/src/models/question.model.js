import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },

    expectedOutput: {
      type: String,
      required: true,
    },

    isHidden: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const codingMetaSchema = new mongoose.Schema(
  {
    allowedLanguages: [
      {
        type: String,
      },
    ],

    starterCode: {
      type: String,
      default: "",
    },

    testCases: [testCaseSchema],
  },
  {
    _id: false,
  },
);

const questionSchema = new mongoose.Schema(
  {
    skillId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["mcq", "technical", "coding"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["fresher", "experienced", "both"],
      default: "both",
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: [
      {
        type: String,
      },
    ],

    correctAnswer: {
      type: String,
      required: true,
      select: false,
    },

    explanation: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    maxScore: {
      type: Number,
      default: 10,
    },

    timeLimitSeconds: {
      type: Number,
      default: 60,
    },

    codingMeta: codingMetaSchema,

    source: {
      type: String,
      enum: ["MANUAL", "AI"],
      default: "MANUAL",
      index: true,
    },

    generatedBy: {
      type: String,
      default: null,
    },

    modelVersion: {
      type: String,
      default: null,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },

    approvedBy: {
      type: String,
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    importedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

questionSchema.index({
  skillId: 1,
  difficulty: 1,
  type: 1,
});

questionSchema.index({
  approvalStatus: 1,
  source: 1,
});

questionSchema.index({
  questionText: "text",
});

export default mongoose.model("Question", questionSchema);
