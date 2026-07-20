import express from "express";

import { generateQuestions } from "../controllers/aiQuestion.controller.js";

import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { generateQuestionsSchema } from "../validators/aiQuestion.validator.js";

const router = express.Router();

/**
 * Candidate Assessment
 */
router.post(
  "/generate",
  auth,
  authorize("candidate"),
  validate(generateQuestionsSchema),
  generateQuestions,
);

export default router;
