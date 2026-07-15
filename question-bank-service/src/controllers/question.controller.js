import QuestionService from "../services/question.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Create Question (Manual)
 */
export const createQuestion = asyncHandler(async (req, res) => {
  const question = await QuestionService.createQuestion(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, question, "Question created successfully"));
});

/**
 * Bulk AI Import
 */
export const importAIQuestions = asyncHandler(async (req, res) => {
  const result = await QuestionService.importAIQuestions(req.body.questions);

  return res
    .status(201)
    .json(new ApiResponse(201, result, "AI questions imported successfully"));
});

/**
 * Pending AI Questions
 */
export const getPendingQuestions = asyncHandler(async (req, res) => {
  const questions = await QuestionService.getPendingQuestions();

  return res
    .status(200)
    .json(
      new ApiResponse(200, questions, "Pending questions fetched successfully"),
    );
});

/**
 * Approve Question
 */
export const approveQuestion = asyncHandler(async (req, res) => {
  const question = await QuestionService.approveQuestion(
    req.params.id,
    req.user.userId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, question, "Question approved successfully"));
});

/**
 * Reject Question
 */
export const rejectQuestion = asyncHandler(async (req, res) => {
  const question = await QuestionService.rejectQuestion(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, question, "Question rejected successfully"));
});

/**
 * Questions by Skill
 */
export const getQuestionsBySkill = asyncHandler(async (req, res) => {
  const questions = await QuestionService.getQuestionsBySkill(
    req.params.skillId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "Questions fetched successfully"));
});

/**
 * Filter Questions
 */
export const getFilteredQuestions = asyncHandler(async (req, res) => {
  const questions = await QuestionService.getFilteredQuestions(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "Questions fetched successfully"));
});

/**
 * Delete Question
 */
export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await QuestionService.deleteQuestion(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, question, "Question deleted successfully"));
});
