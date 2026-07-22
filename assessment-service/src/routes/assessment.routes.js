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

export default router;
