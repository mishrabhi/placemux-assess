import Joi from "joi";

export const updateProfileSchema = Joi.object({
  phone: Joi.string().trim().required(),

  yearsOfExperience: Joi.number().min(0).default(0),

  resumeUrl: Joi.string().uri().allow(null, ""),
});

export const addSkillsSchema = Joi.object({
  skills: Joi.array()
    .items(
      Joi.object({
        skillId: Joi.string().hex().length(24).required(),

        skillName: Joi.string()
          .trim()
          .required(),
      })
    )
    .min(1)
    .required(),
});
