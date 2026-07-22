import express from "express";
import {
  startAssessment,
  saveAnswer,
  getAssessment,
  submitAssessment,
  getHistory,
} from "../controllers/assessment.controller.js";

import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { startAssessmentSchema } from "../validators/startAssessment.validator.js";

const router = express.Router();

/**
 * Start Assessment
 */
router.post("/start", auth, validate(startAssessmentSchema), startAssessment);

/**
 * Save Answer
 */
router.post(
  "/:assessmentId/answer",
  auth,
  validate(saveAnswerSchema),
  saveAnswer,
);

/**
 * Get Assessment
 */
router.get("/:assessmentId", auth, getAssessment);

/**
 * Submit Assessment
 */
router.post(
  "/:assessmentId/submit",
  auth,
  validate(submitAssessmentSchema),
  submitAssessment,
);

/**
 * Assessment History
 */
router.get("/history", auth, getHistory);

/**
 * Get Internal Assessments
 */
router.get(
  "/internal/:assessmentId",
  auth,
  getInternalAssessment,
);

export default router;
