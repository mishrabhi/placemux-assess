import Assessment from "../models/assessment.model.js";
import QuestionSnapshot from "../models/questionSnapshot.model.js";

import UserClient from "../integrations/user.client.js";
import QuestionBankClient from "../integrations/questionBank.client.js";

import ApiError from "../utils/ApiError.js";
import CandidateAnswer from "../models/candidateAnswer.model.js";

class AssessmentService {
  /**
   * Start Assessment
   */
  async startAssessment(accessToken, candidateId, payload) {
    /**
     * Check Existing Assessment
     */
    const existingAssessment = await Assessment.findOne({
      candidateId,
      status: "in_progress",
    });

    if (existingAssessment) {
      throw new ApiError(409, "An assessment is already in progress.");
    }

    /**
     * Fetch Candidate Profile
     */
    const profile = await UserClient.getCandidateProfile(accessToken);
    if (!profile) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    if (!profile.selectedSkills || profile.selectedSkills.length === 0) {
      throw new ApiError(400, "Candidate has not selected any skills.");
    }

    /**
     * Build Assessment Blueprint
     */
    const blueprint = {
      assessmentId: null,

      candidateId,

      experienceLevel:
        profile.yearsOfExperience > 0 ? "experienced" : "fresher",

      difficulty: payload.difficulty,

      skills: profile.selectedSkills,

      distribution: payload.distribution,
    };

    /**
     * Generate Questions
     */
    const generatedQuestions = await QuestionBankClient.generateQuestions(
      accessToken,
      blueprint,
    );

    /**
     * Create Assessment
     */
    const assessment = await Assessment.create({
      candidateId,

      experienceLevel: blueprint.experienceLevel,

      durationMinutes: payload.durationMinutes,

      questionCount: generatedQuestions.questions.length,
    });

    /**
     * Save Assessment ID into Blueprint
     */
    blueprint.assessmentId = assessment.assessmentId;

    /**
     * Save Question Snapshot
     */
    const snapshotDocuments = generatedQuestions.questions.map((question) => ({
      assessmentId: assessment.assessmentId,

      ...question,
    }));

    await QuestionSnapshot.insertMany(snapshotDocuments);

    /**
     * Remove Correct Answers
     */
    const questionsForCandidate = generatedQuestions.questions.map(
      ({ correctAnswer, explanation, ...question }) => question,
    );

    /**
     * Return Assessment
     */
    return {
      assessmentId: assessment.assessmentId,

      durationMinutes: assessment.durationMinutes,

      questionCount: assessment.questionCount,

      questions: questionsForCandidate,
    };
  }

  /**
   * Save Answer
   */
  async saveAnswer(assessmentId, payload) {
    const assessment = await Assessment.findOne({
      assessmentId,
      status: "in_progress",
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found.");
    }

    const answer = await CandidateAnswer.findOneAndUpdate(
      {
        assessmentId,
        questionId: payload.questionId,
      },

      {
        selectedAnswer: payload.selectedAnswer,

        codingSubmission: payload.codingSubmission,

        markedForReview: payload.markedForReview,

        answeredAt: new Date(),
      },

      {
        upsert: true,
        new: true,
      },
    );

    return answer;
  }

  /**
   * Save Answer
   */
  async getAssessment(assessmentId) {
    const assessment = await Assessment.findOne({
      assessmentId,
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found.");
    }

    const questions = await QuestionSnapshot.find({
      assessmentId,
    }).select("-correctAnswer -explanation");

    const answers = await CandidateAnswer.find({
      assessmentId,
    });

    return {
      assessment,

      questions,

      answers,
    };
  }
  /**
   * Submit Assessment
   */
  async submitAssessment(assessmentId) {
    const assessment = await Assessment.findOne({
      assessmentId,
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found.");
    }

    if (assessment.status !== "in_progress") {
      throw new ApiError(400, "Assessment already submitted.");
    }

    assessment.status = "submitted";

    assessment.submittedAt = new Date();

    await assessment.save();

    return assessment;
  }

  /**
   * Get History
   */
  async getHistory(candidateId) {
    return await Assessment.find({
      candidateId,
    }).sort({
      createdAt: -1,
    });
  }

  /**
     * Get Internal Assessment
     */
  async getInternalAssessment(assessmentId) {
    const assessment = await Assessment.findOne({
      assessmentId,
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found.");
    }

    const questions = await QuestionSnapshot.find({
      assessmentId,
    });

    const answers = await CandidateAnswer.find({
      assessmentId,
    });

    return {
      assessment,

      questions,

      answers,
    };
  }
}

export default new AssessmentService();
