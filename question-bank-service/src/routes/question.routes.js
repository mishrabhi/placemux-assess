import express from "express";
const router = express.Router();
import authorize from "../middlewares/role.middleware.js";  

import {
  createQuestion,
  importAIQuestions,
  getPendingQuestions,
  approveQuestion,
  rejectQuestion,
  getQuestionsBySkill,
  getFilteredQuestions,
  deleteQuestion,
} from "../controllers/question.controller.js";

import validate from "../middlewares/validate.middleware.js";

import {
  createQuestionSchema,
  importAIQuestionsSchema,
} from "../validators/question.validator.js";

import auth from "../middlewares/auth.middleware.js";

/**
 * Manual Question Creation
 */
router.post("/", auth,authorize("admin"), validate(createQuestionSchema), createQuestion);

/**
 * AI Bulk Import
 */
router.post(
  "/ai-import",
  auth,
  authorize("admin"),
  validate(importAIQuestionsSchema),
  importAIQuestions,
);

/**
 * Pending AI Questions
 */
router.get("/pending", auth,authorize("admin"), getPendingQuestions);

/**
 * Approve Question
 */
router.patch("/:id/approve", auth,authorize("admin"), approveQuestion);

/**
 * Reject Question
 */
router.patch("/:id/reject", auth,authorize("admin"), rejectQuestion);

/**
 * Questions by Skill
 */
router.get("/skill/:skillId", auth, getQuestionsBySkill);

/**
 * Filter Questions
 */
router.get("/", auth, getFilteredQuestions);

/**
 * Soft Delete
 */
router.delete("/:id", auth,authorize("admin"), deleteQuestion);

export default router;
