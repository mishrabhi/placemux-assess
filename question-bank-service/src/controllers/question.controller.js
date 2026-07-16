import QuestionService from "../services/question.service.js";

import ApiResponse from "../utils/ApiResponse.js";

import asyncHandler from "../utils/asyncHandler.js";

/**
 * Create Manual Question
 */
export const createQuestion = asyncHandler(async (req, res) => {

  const question =
    await QuestionService.createQuestion(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      question,
      "Question created successfully"
    )
  );

});

/**
 * Import AI Questions
 */
export const importAIQuestions = asyncHandler(async (req, res) => {

  const result =
    await QuestionService.importAIQuestions(
      req.body.questions
    );

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "AI Questions imported successfully"
    )
  );

});

/**
 * Get Question By ID
 */
export const getQuestionById = asyncHandler(async (req, res) => {

  const question =
    await QuestionService.getQuestionById(
      req.params.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      question,
      "Question fetched successfully"
    )
  );

});

/**
 * Update Question
 */
export const updateQuestion = asyncHandler(async (req, res) => {

  const question =
    await QuestionService.updateQuestion(
      req.params.id,
      req.body
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      question,
      "Question updated successfully"
    )
  );

});

/**
 * Pending Questions
 */
export const getPendingQuestions = asyncHandler(async (req, res) => {

  const questions =
    await QuestionService.getPendingQuestions();

  return res.status(200).json(
    new ApiResponse(
      200,
      questions,
      "Pending questions fetched successfully"
    )
  );

});

/**
 * Approve Question
 */
export const approveQuestion = asyncHandler(async (req, res) => {

  const question =
    await QuestionService.approveQuestion(
      req.params.id,
      req.user.userId
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      question,
      "Question approved successfully"
    )
  );

});

/**
 * Reject Question
 */
export const rejectQuestion = asyncHandler(async (req, res) => {

  const question =
    await QuestionService.rejectQuestion(
      req.params.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      question,
      "Question rejected successfully"
    )
  );

});

/**
 * Bulk Approve
 */
export const bulkApproveQuestions = asyncHandler(async (req, res) => {

  const result =
    await QuestionService.bulkApproveQuestions(
      req.body.questionIds,
      req.user.userId
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Questions approved successfully"
    )
  );

});

/**
 * Bulk Reject
 */
export const bulkRejectQuestions = asyncHandler(async (req, res) => {

  const result =
    await QuestionService.bulkRejectQuestions(
      req.body.questionIds
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Questions rejected successfully"
    )
  );

});

/**
 * Search Questions
 */
export const searchQuestions = asyncHandler(async (req, res) => {

  const questions =
    await QuestionService.searchQuestions(
      req.query.q
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      questions,
      "Search completed successfully"
    )
  );

});

/**
 * Random Questions
 */
export const getRandomQuestions = asyncHandler(async (req, res) => {

  const questions =
    await QuestionService.getRandomQuestions(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      questions,
      "Random questions fetched successfully"
    )
  );

});

/**
 * Questions By Skill
 */
export const getQuestionsBySkill = asyncHandler(async (req, res) => {

  const questions =
    await QuestionService.getQuestionsBySkill(
      req.params.skillId
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      questions,
      "Questions fetched successfully"
    )
  );

});

/**
 * Filter Questions
 */
export const getFilteredQuestions = asyncHandler(async (req, res) => {

  const questions =
    await QuestionService.getFilteredQuestions(
      req.query
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      questions,
      "Questions fetched successfully"
    )
  );

});

/**
 * Delete Question
 */
export const deleteQuestion = asyncHandler(async (req, res) => {

  const question =
    await QuestionService.deleteQuestion(
      req.params.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      question,
      "Question deleted successfully"
    )
  );

});