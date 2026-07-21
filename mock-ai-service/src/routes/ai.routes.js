import express from "express";
import { generateQuestions } from "../controllers/ai.controller.js";

const router = express.Router();

/**
 * Generate Questions
 */
router.post("/generate", generateQuestions);

export default router;