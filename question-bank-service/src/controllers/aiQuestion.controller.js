import AIQuestionService from "../services/aiQuestion.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import successResponse from "../utils/ApiResponse.js";

export const generateQuestions = asyncHandler(async (req, res) => {
  const result = await AIQuestionService.generateQuestions(req.body);

  return successResponse(res, {
    statusCode: 200,
    message: "Questions generated successfully.",
    data: result,
  });
});