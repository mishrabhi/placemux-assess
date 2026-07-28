import Evaluation from "../models/evaluation.model.js";
import EvaluationDetail from "../models/evaluationDetail.model.js";

import AssessmentClient from "../integrations/assessment.client.js";
import AIClient from "../integrations/ai.client.js";

import ApiError from "../utils/ApiError.js";

class EvaluationService {
  async evaluateAssessment(accessToken, assessmentId, user) {
    if (user.role !== "admin") {
      throw new ApiError(403, "Forbidden.");
    }

    /**
     * Prevent duplicate evaluation
     */
    const existingEvaluation = await Evaluation.findOne({
      assessmentId,
    });

    if (existingEvaluation) {
      throw new ApiError(409, "Assessment has already been evaluated.");
    }

    /**
     * Fetch Assessment
     */
    const assessmentData = await AssessmentClient.getAssessmentData(
      assessmentId,
      accessToken,
    );

    if (assessmentData.assessment.status !== "submitted") {
      throw new ApiError(
        400,
        "Assessment must be submitted before it can be evaluated.",
      );
    }

    if (user.role !== "admin" && assessmentData.assessment.candidateId !== user.userId) {
      throw new ApiError(403, "Forbidden.");
    }

    /**
     * Build AI Payload
     */
    const payload = {
      assessment: assessmentData.assessment,

      questions: assessmentData.questions,

      answers: assessmentData.answers,
    };

    /**
     * AI Evaluation
     */
    const evaluation = await AIClient.evaluateAssessment(accessToken, payload);

    /**
     * Save Evaluation
     */
    const evaluationDocument = await Evaluation.create({
      assessmentId,

      candidateId: assessmentData.assessment.candidateId,

      scores: evaluation.scores,

      totalScore: evaluation.totalScore,

      maxScore: evaluation.maxScore,

      percentage: evaluation.percentage,

      passed: evaluation.passed,

      status: "completed",

      evaluationEngine: {
        mcq: "AI",
        technical: "AI",
        coding: "AI",
      },

      evaluatedAt: new Date(),
    });

    /**
     * Save Evaluation Details
     */
    const details = evaluation.details.map((detail) => ({
      evaluationId: evaluationDocument.evaluationId,

      assessmentId,

      ...detail,

      evaluatedBy: "AI",
    }));

    await EvaluationDetail.insertMany(details);

    /**
     * Return Result
     */
    return {
      evaluationId: evaluationDocument.evaluationId,

      assessmentId,

      totalScore: evaluation.totalScore,

      maxScore: evaluation.maxScore,

      percentage: evaluation.percentage,

      passed: evaluation.passed,
    };
  }

  /**
   * Get Evaluation Report
   */
  async getEvaluationReport(assessmentId, user) {
    const evaluation = await Evaluation.findOne({
      assessmentId,
    });

    if (!evaluation) {
      throw new ApiError(404, "Evaluation not found.");
    }

    if (user.role !== "admin" && evaluation.candidateId !== user.userId) {
      throw new ApiError(403, "Forbidden.");
    }

    const details = await EvaluationDetail.find({
      assessmentId,
    });

    return {
      evaluation,

      details,
    };
  }
  
  /**
   * Get Candidate Result
   */
  async getCandidateResult(assessmentId, user) {
    const evaluation = await Evaluation.findOne({
      assessmentId,
    });

    if (!evaluation) {
      throw new ApiError(404, "Evaluation not found.");
    }

    if (user.role !== "admin" && evaluation.candidateId !== user.userId) {
      throw new ApiError(403, "Forbidden.");
    }

    return {
      evaluationId: evaluation.evaluationId,

      assessmentId: evaluation.assessmentId,

      totalScore: evaluation.totalScore,

      maxScore: evaluation.maxScore,

      percentage: evaluation.percentage,

      passed: evaluation.passed,

      scores: evaluation.scores,

      evaluatedAt: evaluation.evaluatedAt,
    };
  }
}

export default new EvaluationService();
