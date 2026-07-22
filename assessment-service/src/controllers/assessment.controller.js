import AssessmentService from "../services/assessment.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

//start assessment
export const startAssessment = asyncHandler(async (req, res) => {
  const accessToken = req.headers.authorization;

  const candidateId = req.user.userId;

  const assessment = await AssessmentService.startAssessment(
    accessToken,
    candidateId,
    req.body,
  );

  return res.status(201).json(
    new ApiResponse(
      201,

      assessment,

      "Assessment started successfully.",
    ),
  );
});

//save answers
export const saveAnswer = asyncHandler(async (req, res) => {
  const answer = await AssessmentService.saveAnswer(
    req.params.assessmentId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, answer, "Answer saved successfully."));
});

//get assessment
export const getAssessment = asyncHandler(async (req, res) => {
  const assessment = await AssessmentService.getAssessment(
    req.params.assessmentId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, assessment, "Assessment fetched successfully."));
});

//submit assessment
export const submitAssessment = asyncHandler(async (req, res) => {
  const assessment = await AssessmentService.submitAssessment(
    req.params.assessmentId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, assessment, "Assessment submitted successfully."),
    );
});

//getHistory
export const getHistory = asyncHandler(async (req, res) => {
  const history = await AssessmentService.getHistory(req.user.userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, history, "Assessment history fetched successfully."),
    );
});
