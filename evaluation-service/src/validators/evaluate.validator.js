import Joi from "joi";

export const evaluateSchema = Joi.object({
  assessmentId: Joi.string().required(),
});
