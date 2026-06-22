import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: String,
    expectedOutput: String,
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
    allowedLanguages: [String],

    starterCode: String,

    testCases: [testCaseSchema],
  },
  {
    _id: false,
  },
);

const questionSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
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
    },

    options: [String],

    correctAnswer: {
      type: String,
      required: true,
      select: false,
    },

    maxScore: {
      type: Number,
      default: 10,
    },

    timeLimitSeconds: Number,

    codingMeta: codingMetaSchema,
  },
  {
    timestamps: true,
  },
);

questionSchema.index({
  skillId: 1,
  type: 1,
  difficulty: 1,
  experienceLevel: 1,
});

export default mongoose.model("Question", questionSchema);
