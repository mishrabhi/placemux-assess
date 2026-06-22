import Joi from "joi";

export const createSkillSchema = Joi.object({
    name:Joi.string().required(),

    category:Joi.string().required()
});