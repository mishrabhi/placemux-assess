import questionService from "../services/question.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

//create questions
export const createQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.createQuestion(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, question, "Question created successfully"));
});

//get questions according to user skill
export const getQuestionsBySkill = asyncHandler(async (req, res) => {
  const questions = await questionService.getQuestionsBySkill(
    req.params.skillId,
  );

  res.status(200).json(new ApiResponse(200, questions));
});

//get filtered questions
export const getFilteredQuestions = asyncHandler(async (req, res) => {
  const questions = await questionService.getFilteredQuestions(req.query);

  res.status(200).json(new ApiResponse(200, questions));
});
