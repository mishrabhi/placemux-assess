import Joi from "joi";

export const startAssessmentSchema = Joi.object({
  durationMinutes: Joi.number()
    .integer()
    .min(15)
    .max(180)
    .default(60),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard")
    .required(),

  distribution: Joi.object({
    mcq: Joi.number()
      .integer()
      .min(0)
      .required(),

    technical: Joi.number()
      .integer()
      .min(0)
      .required(),

    coding: Joi.number()
      .integer()
      .min(0)
      .required(),
  })
    .required()
    .custom((value, helpers) => {
      const total =
        value.mcq +
        value.technical +
        value.coding;

      if (total === 0) {
        return helpers.error("any.invalid");
      }

      return value;
    }, "Question Distribution Validation")
    .messages({
      "any.invalid":
        "At least one question must be requested.",
    }),
});