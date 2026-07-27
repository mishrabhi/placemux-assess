import Joi from "joi";

const skillSchema = Joi.object({
  name: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
});

export const createSkillSchema = Joi.alternatives().try(
  skillSchema,
  Joi.array().items(skillSchema).min(1),
);