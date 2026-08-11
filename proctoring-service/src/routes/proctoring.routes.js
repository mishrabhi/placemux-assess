import express from "express";
import { logEvent, getStatus } from "../controllers/proctoring.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { proctoringEventSchema } from "../validators/proctoring.validator.js";

const router = express.Router();

router.post("/event", validate(proctoringEventSchema), logEvent);
router.get("/:assessmentId/status", getStatus);

export default router;
