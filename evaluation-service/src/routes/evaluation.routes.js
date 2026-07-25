import express from "express";

import {
  evaluateAssessment,
  getEvaluationReport,
  getCandidateResult,
} from "../controllers/evaluation.controller.js";

import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { evaluateSchema } from "../validators/evaluate.validator.js";

const router = express.Router();

/**
 * Evaluate Assessment
 */
router.post(
  "/evaluate",

  auth,

  authorize("admin"),

  validate(evaluateSchema),

  evaluateAssessment,
);

/**
 * Candidate Result
 */
router.get(
  "/result/:assessmentId",

  auth,

  getCandidateResult,
);

/**
 * Detailed Evaluation Report
 */
router.get(
  "/:assessmentId",

  auth,

  getEvaluationReport,
);

export default router;
