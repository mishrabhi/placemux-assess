import Joi from "joi";

export const saveAnswerSchema = Joi.object({
  questionId: Joi.string().required(),

  selectedAnswer: Joi.string().allow("", null),

  codingSubmission: Joi.string().allow("", null),

  markedForReview: Joi.boolean().default(false),
});