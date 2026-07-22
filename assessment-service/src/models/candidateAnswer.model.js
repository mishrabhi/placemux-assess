import mongoose from "mongoose";

const candidateAnswerSchema = new mongoose.Schema(
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

    selectedAnswer: {
      type: String,
      default: null,
    },

    codingSubmission: {
      type: String,
      default: null,
    },

    markedForReview: {
      type: Boolean,
      default: false,
    },

    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

candidateAnswerSchema.index({
  assessmentId: 1,
  questionId: 1,
});

candidateAnswerSchema.index(
  {
    assessmentId: 1,
    questionId: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model(
  "CandidateAnswer",
  candidateAnswerSchema,
);