import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  getProfile,
  updateProfile,
  addSkills,
} from "../controllers/user.controller.js";

import {
  updateProfileSchema,
  addSkillsSchema,
} from "../validators/user.validator.js";

const router = express.Router();

router.get("/profile", verifyJWT, getProfile);

router.put("/profile", verifyJWT, validate(updateProfileSchema), updateProfile);

router.post("/profile/skills", verifyJWT, validate(addSkillsSchema), addSkills);

export default router;
