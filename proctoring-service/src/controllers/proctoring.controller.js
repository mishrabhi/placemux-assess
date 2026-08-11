import ProctoringService from "../services/proctoring.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const logEvent = asyncHandler(async (req, res) => {
  const result = await ProctoringService.handleViolationEvent(req.body);

  return res.status(201).json(
    new ApiResponse(201, result, "Proctoring event logged successfully."),
  );
});

export const getStatus = asyncHandler(async (req, res) => {
  const status = await ProctoringService.getViolationStatus(req.params.assessmentId);

  return res.status(200).json(
    new ApiResponse(200, status, "Proctoring status fetched successfully."),
  );
});
