import Joi from "joi";

export const createQuestionSchema = Joi.object({

    skillId:Joi.string().required(),

    type:Joi.string()
    .valid(
        "mcq",
        "technical",
        "coding"
    )
    .required(),

    difficulty:Joi.string()
    .valid(
        "easy",
        "medium",
        "hard"
    )
    .required(),

    experienceLevel:Joi.string()
    .valid(
        "fresher",
        "experienced",
        "both"
    )
    .default("both"),

    questionText:Joi.string()
    .required(),

    options:Joi.array()
    .items(Joi.string()),

    correctAnswer:Joi.string()
    .required(),

    maxScore:Joi.number()
    .default(10)
});