import express from "express";

import {
  createQuestion,
  getQuestionsBySkill,
  getFilteredQuestions,
} from "../controllers/question.controller.js";

import validate from "../middlewares/validate.middleware.js";

import { createQuestionSchema } from "../validators/question.validator.js";

const router = express.Router();

router.post("/", validate(createQuestionSchema), createQuestion);

router.get("/filter", getFilteredQuestions);

router.get("/:skillId", getQuestionsBySkill);

export default router;
