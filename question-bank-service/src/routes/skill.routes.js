import express from "express";

import {
  createSkill,
  getAllSkills,
  deleteSkill,
} from "../controllers/skill.controller.js";

import validate from "../middlewares/validate.middleware.js";

import { createSkillSchema } from "../validators/skill.validator.js";

const router = express.Router();

router.post("/", validate(createSkillSchema), createSkill);

router.get("/", getAllSkills);

router.delete("/:id", deleteSkill);

export default router;
