import mongoose from "mongoose";

const codingMetaSchema = new mongoose.Schema(
  {
    allowedLanguages: [String],

    starterCode: String,

    testCases: [
      {
        input: String,

        expectedOutput: String,

        isHidden: Boolean,
      },
    ],
  },
  {
    _id: false,
  },
);

const questionSnapshotSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      index: true,
    },

    questionId: {
      type: String,
      required: true,
    },

    skillId: String,

    skillName: String,

    type: {
      type: String,
      enum: ["mcq", "technical", "coding"],
    },

    difficulty: String,

    experienceLevel: String,

    questionText: String,

    options: [String],

    correctAnswer: String,

    explanation: String,

    codingMeta: codingMetaSchema,

    maxScore: Number,

    timeLimitSeconds: Number,

    generatedBy: String,

    modelVersion: String,

    confidence: Number,
  },
  {
    timestamps: true,
  },
);


export default mongoose.model("QuestionSnapshot", questionSnapshotSchema);
