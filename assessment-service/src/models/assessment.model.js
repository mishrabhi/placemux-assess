import mongoose from "mongoose";
import generateAssessmentId from "../utils/generateAssessmentId.js";

const assessmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      unique: true,
      default: generateAssessmentId,
      index: true,
    },

    candidateId: {
      type: String,
      required: true,
      index: true,
    },

    experienceLevel: {
      type: String,
      enum: ["fresher", "experienced"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "submitted", "evaluated"],
      default: "in_progress",
      index: true,
    },

    durationMinutes: {
      type: Number,
      default: 60,
    },

    questionCount: {
      type: Number,
      default: 0,
    },

    answeredCount: {
      type: Number,
      default: 0,
    },

    attemptedCount: {
      type: Number,
      default: 0,
    },

    lastAnsweredAt: {
      type: Date,
      default: null,
    },

    submissionAnswerCount: {
      type: Number,
      default: 0,
    },

    progressPercent: {
      type: Number,
      default: 0,
    },

    markedForReviewCount: {
      type: Number,
      default: 0,
    },

    skippedCount: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: null,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
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


export default mongoose.model("Assessment", assessmentSchema);
