import Joi from "joi";

export const createQuestionSchema = Joi.object({
  skillId: Joi.string().required(),

  type: Joi.string()
    .valid("mcq", "technical", "coding")
    .required(),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard")
    .required(),

  experienceLevel: Joi.string()
    .valid("fresher", "experienced", "both")
    .default("both"),

  questionText: Joi.string().required(),

  options: Joi.array().items(Joi.string()),

  correctAnswer: Joi.string().required(),

  explanation: Joi.string().allow("").default(""),

  tags: Joi.array().items(Joi.string()).default([]),

  maxScore: Joi.number().default(10),

  timeLimitSeconds: Joi.number().default(60),

  codingMeta: Joi.object({
    allowedLanguages: Joi.array().items(Joi.string()),

    starterCode: Joi.string().allow("").default(""),

    testCases: Joi.array().items(
      Joi.object({
        input: Joi.string().required(),

        expectedOutput: Joi.string().required(),

        isHidden: Joi.boolean().default(true),
      })
    ),
  }).optional(),
});

export const updateQuestionSchema = createQuestionSchema;

export const importAIQuestionsSchema = Joi.object({
  questions: Joi.array()
    .items(createQuestionSchema.keys({
      generatedBy: Joi.string().required(),

      modelVersion: Joi.string().required(),

      confidence: Joi.number()
        .min(0)
        .max(1)
        .required(),
    }))
    .min(1)
    .required(),
});

export const bulkApproveSchema = Joi.object({
  questionIds: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
});

export const bulkRejectSchema = Joi.object({
  questionIds: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
});