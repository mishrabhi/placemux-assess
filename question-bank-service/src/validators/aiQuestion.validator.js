import Joi from "joi";

const skillSchema = Joi.object({
  skillId: Joi.string().trim().required(),

  skillName: Joi.string().trim().required(),

  weight: Joi.number().min(1).max(100).required(),
});

export const generateQuestionsSchema = Joi.object({
  assessmentId: Joi.string().trim().required(),

  candidateId: Joi.string().trim().required(),

  experienceLevel: Joi.string()
    .valid("fresher", "experienced")
    .required(),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard")
    .required(),

  skills: Joi.array()
    .items(skillSchema)
    .min(1)
    .required(),

  distribution: Joi.object({
    mcq: Joi.number().integer().min(0).required(),

    technical: Joi.number().integer().min(0).required(),

    coding: Joi.number().integer().min(0).required(),
  }).required(),
});