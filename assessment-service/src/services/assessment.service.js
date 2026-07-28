import Assessment from "../models/assessment.model.js";
import QuestionSnapshot from "../models/questionSnapshot.model.js";

import UserClient from "../integrations/user.client.js";
import QuestionBankClient from "../integrations/questionBank.client.js";
import EvaluationClient from "../integrations/evaluation.client.js";

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
      // assessmentId: null,

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
    // blueprint.assessmentId = assessment.assessmentId;

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
      answeredCount: assessment.answeredCount,
      attemptedCount: assessment.attemptedCount,
      lastAnsweredAt: assessment.lastAnsweredAt,
      submissionAnswerCount: assessment.submissionAnswerCount,
      progressPercent: assessment.progressPercent,
      markedForReviewCount: assessment.markedForReviewCount,
      skippedCount: assessment.skippedCount,
      questions: questionsForCandidate,
    };
  }

  /**
   * Save Answer
   */
  async saveAnswer(assessmentId, payload, user) {
    const assessment = await Assessment.findOne({
      assessmentId,
      status: "in_progress",
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found or not in progress.");
    }

    if (user.role !== "admin" && assessment.candidateId !== user.userId) {
      throw new ApiError(403, "Forbidden.");
    }

    const question = await QuestionSnapshot.findOne({
      assessmentId,
      questionId: payload.questionId,
    });

    if (!question) {
      throw new ApiError(404, "Question not found for this assessment.");
    }

    const existingAnswer = await CandidateAnswer.findOne({
      assessmentId,
      questionId: payload.questionId,
    });

    const isNewAnswer = !existingAnswer;

    const previouslyAnswered = Boolean(
      existingAnswer?.selectedAnswer || existingAnswer?.codingSubmission,
    );

    const nowAnswered = Boolean(
      payload.selectedAnswer || payload.codingSubmission,
    );

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

    const update = {
      lastAnsweredAt: new Date(),
    };

    if (isNewAnswer) {
      update.attemptedCount = (assessment.attemptedCount || 0) + 1;
    }

    const answeredCountDelta = nowAnswered && !previouslyAnswered ? 1 : 0;

    if (answeredCountDelta > 0) {
      update.answeredCount = (assessment.answeredCount || 0) + 1;
    }

    const updatedAnsweredCount =
      (assessment.answeredCount || 0) + answeredCountDelta;

    if (assessment.questionCount > 0) {
      update.progressPercent = Math.round(
        (updatedAnsweredCount / assessment.questionCount) * 100,
      );
    }

    await Assessment.findOneAndUpdate({ assessmentId }, update);

    return answer;
  }

  /**
   * Save Answer
   */
  async getAssessment(assessmentId, user) {
    const assessment = await Assessment.findOne({
      assessmentId,
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found.");
    }

    if (user.role !== "admin" && assessment.candidateId !== user.userId) {
      throw new ApiError(403, "Forbidden.");
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
  async submitAssessment(assessmentId, user) {
    const assessment = await Assessment.findOne({
      assessmentId,
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found.");
    }

    if (user.role !== "admin" && assessment.candidateId !== user.userId) {
      throw new ApiError(403, "Forbidden.");
    }

    if (assessment.status !== "in_progress") {
      throw new ApiError(400, "Assessment already submitted.");
    }

    const answers = await CandidateAnswer.find({ assessmentId });

    const answeredCount = answers.filter(
      (answer) => answer.selectedAnswer || answer.codingSubmission,
    ).length;

    const markedForReviewCount = answers.filter(
      (answer) => answer.markedForReview).length;

    const submissionAnswerCount = answers.length;

    const skippedCount = Math.max(
      0,
      assessment.questionCount - answeredCount,
    );

    assessment.status = "submitted";
    assessment.submittedAt = new Date();
    assessment.answeredCount = answeredCount;
    assessment.attemptedCount = submissionAnswerCount;
    assessment.submissionAnswerCount = submissionAnswerCount;
    assessment.markedForReviewCount = markedForReviewCount;
    assessment.skippedCount = skippedCount;
    assessment.progressPercent = assessment.questionCount
      ? Math.round((answeredCount / assessment.questionCount) * 100)
      : 0;

    await assessment.save();

    if (
      process.env.EVALUATION_SERVICE_URL &&
      process.env.SERVICE_TOKEN &&
      assessment.status === "submitted"
    ) {
      try {
        const evaluationResult = await EvaluationClient.evaluateAssessment(
          process.env.SERVICE_TOKEN,
          assessment.assessmentId,
        );

        if (evaluationResult?.totalScore != null) {
          assessment.status = "evaluated";
          assessment.evaluatedAt = new Date();
          assessment.score = evaluationResult.totalScore;
          await assessment.save();
        }
      } catch (err) {
        console.error(
          "Evaluation service call failed during submit:",
          err.message,
        );
      }
    }

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
  async getInternalAssessment(assessmentId, user) {
    if (user.role !== "admin") {
      throw new ApiError(403, "Forbidden.");
    }

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
