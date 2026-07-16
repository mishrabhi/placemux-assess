import express from "express";

const router = express.Router();

import {
  createQuestion,
  importAIQuestions,
  getQuestionById,
  updateQuestion,
  getPendingQuestions,
  approveQuestion,
  rejectQuestion,
  bulkApproveQuestions,
  bulkRejectQuestions,
  searchQuestions,
  getRandomQuestions,
  getQuestionsBySkill,
  getFilteredQuestions,
  deleteQuestion,
} from "../controllers/question.controller.js";

import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createQuestionSchema,
  updateQuestionSchema,
  importAIQuestionsSchema,
  bulkApproveSchema,
  bulkRejectSchema,
} from "../validators/question.validator.js";

/**
 * ===========================
 * Question CRUD
 * ===========================
 */

// Create Manual Question
router.post(
  "/",
  auth,
  authorize("admin"),
  validate(createQuestionSchema),
  createQuestion
);

// Import AI Questions
router.post(
  "/ai-import",
  auth,
  authorize("admin"),
  validate(importAIQuestionsSchema),
  importAIQuestions
);

// Get Filtered Questions
router.get(
  "/",
  auth,
  getFilteredQuestions
);

// Search Questions
router.get(
  "/search",
  auth,
  searchQuestions
);

// Get Random Questions
router.get(
  "/random",
  auth,
  getRandomQuestions
);

// Pending Questions
router.get(
  "/pending",
  auth,
  authorize("admin"),
  getPendingQuestions
);

// Questions by Skill
router.get(
  "/skill/:skillId",
  auth,
  getQuestionsBySkill
);

// Get Question by ID
router.get(
  "/:id",
  auth,
  getQuestionById
);

// Update Question
router.put(
  "/:id",
  auth,
  authorize("admin"),
  validate(updateQuestionSchema),
  updateQuestion
);

// Delete Question
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteQuestion
);

/**
 * ===========================
 * AI Review
 * ===========================
 */

// Approve One
router.patch(
  "/:id/approve",
  auth,
  authorize("admin"),
  approveQuestion
);

// Reject One
router.patch(
  "/:id/reject",
  auth,
  authorize("admin"),
  rejectQuestion
);

// Bulk Approve
router.patch(
  "/bulk-approve",
  auth,
  authorize("admin"),
  validate(bulkApproveSchema),
  bulkApproveQuestions
);

// Bulk Reject
router.patch(
  "/bulk-reject",
  auth,
  authorize("admin"),
  validate(bulkRejectSchema),
  bulkRejectQuestions
);

export default router;