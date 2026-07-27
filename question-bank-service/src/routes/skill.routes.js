import express from "express";
import {
  createSkill,
  getAllSkills,
  deleteSkill,
} from "../controllers/skill.controller.js";
import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createSkillSchema } from "../validators/skill.validator.js";

const router = express.Router();

router.post(
  "/",
  auth,
  authorize("admin"),
  validate(createSkillSchema),
  createSkill,
);
router.get("/", getAllSkills);
router.delete("/:id", auth, authorize("admin"), deleteSkill);
export default router;
