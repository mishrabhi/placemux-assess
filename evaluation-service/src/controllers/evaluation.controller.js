import EvaluationService from "../services/evaluation.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Evaluate Assessment
 */
export const evaluateAssessment = asyncHandler(async (req, res) => {
  const accessToken = req.headers.authorization;

  const { assessmentId } = req.body;

  const result = await EvaluationService.evaluateAssessment(
    accessToken,
    assessmentId,
    req.user,
  );

  return res.status(201).json(
    new ApiResponse(
      201,

      result,

      "Assessment evaluated successfully.",
    ),
  );
});

/**
 * Get Evaluation Report
 */
export const getEvaluationReport = asyncHandler(async (req, res) => {
  const report = await EvaluationService.getEvaluationReport(
    req.params.assessmentId,
    req.user,
  );

  return res.status(200).json(
    new ApiResponse(
      200,

      report,

      "Evaluation report fetched successfully.",
    ),
  );
});

/**
 * Get Candidate Result
 */
export const getCandidateResult = asyncHandler(async (req, res) => {
  const result = await EvaluationService.getCandidateResult(
    req.params.assessmentId,
    req.user,
  );

  return res.status(200).json(
    new ApiResponse(
      200,

      result,

      "Evaluation result fetched successfully.",
    ),
  );
});
