import Joi from "joi";

export const proctoringEventSchema = Joi.object({
  assessmentId: Joi.string().trim().required(),
  candidateId: Joi.string().trim().required(),
  eventType: Joi.string()
    .valid(
      "face_not_detected",
      "multiple_faces",
      "tab_switch",
      "noise_detected",
      "no_camera",
      "mic_disabled",
      "blur_window",
      "unauthorized_app",
    )
    .required(),
  severity: Joi.string().valid("low", "medium", "high").required(),
  message: Joi.string().trim().optional(),
  snapshotUrl: Joi.string().uri().optional(),
});
