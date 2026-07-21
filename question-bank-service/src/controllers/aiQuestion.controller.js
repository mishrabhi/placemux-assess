import AIQuestionService from "../services/aiQuestion.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const generateQuestions = asyncHandler(async (req, res) => {
  const result = await AIQuestionService.generateQuestions(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Questions generated successfully."
    )
  );
});