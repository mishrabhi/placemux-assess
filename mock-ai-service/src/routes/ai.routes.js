import express from "express";
import { generateQuestions, evaluateAssessment } from "../controllers/ai.controller.js";

const router = express.Router();

/**
 * Generate Questions
 */
router.post("/generate", generateQuestions);

/**
 * Evaluate Assessment
 */
router.post(
    "/evaluate",
    evaluateAssessment
);

export default router;