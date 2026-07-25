import mongoose from "mongoose";

const evaluationDetailSchema = new mongoose.Schema(
  {
    evaluationId: {
      type: String,
      required: true,
      // index: true,
    },

    assessmentId: {
      type: String,
      required: true,
      // index: true,
    },

    questionId: {
      type: String,
      required: true,
    },

    questionType: {
      type: String,
      enum: [
        "mcq",
        "technical",
        "coding",
      ],
      required: true,
    },

    candidateAnswer: {
      type: String,
      default: "",
    },

    correctAnswer: {
      type: String,
      default: "",
    },

    obtainedScore: {
      type: Number,
      default: 0,
    },

    maxScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "correct",
        "incorrect",
        "partial",
        "not_attempted",
      ],
      default: "incorrect",
    },

    feedback: {
      type: String,
      default: "",
    },

    evaluatedBy: {
      type: String,
      default: "Rule Engine",
    },
  },
  {
    timestamps: true,
  },
);

evaluationDetailSchema.index({
  evaluationId: 1,
});

evaluationDetailSchema.index({
  assessmentId: 1,
});

export default mongoose.model(
  "EvaluationDetail",
  evaluationDetailSchema,
);