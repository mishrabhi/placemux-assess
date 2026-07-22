import Assessment from "../models/assessment.model.js";
import QuestionSnapshot from "../models/questionSnapshot.model.js";

import UserClient from "../integrations/user.client.js";
import QuestionBankClient from "../integrations/questionBank.client.js";

import ApiError from "../utils/ApiError.js";

class AssessmentService {

  /**
   * Start Assessment
   */
  async startAssessment(accessToken, candidateId, payload) {

    /**
     * Fetch Candidate Profile
     */
    const profile = await UserClient.getCandidateProfile(accessToken);

    if (!profile) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    if (
      !profile.selectedSkills ||
      profile.selectedSkills.length === 0
    ) {
      throw new ApiError(
        400,
        "Candidate has not selected any skills."
      );
    }

    /**
     * Build Assessment Blueprint
     */
    const blueprint = {
      assessmentId: null,

      candidateId,

      experienceLevel:
        profile.yearsOfExperience > 0
          ? "experienced"
          : "fresher",

      difficulty: payload.difficulty,

      skills: profile.selectedSkills,

      distribution: payload.distribution,
    };

    /**
     * Generate Questions
     */
    const generatedQuestions =
      await QuestionBankClient.generateQuestions(
        accessToken,
        blueprint
      );

    /**
     * Create Assessment
     */
    const assessment = await Assessment.create({
      candidateId,

      experienceLevel:
        blueprint.experienceLevel,

      durationMinutes:
        payload.durationMinutes,

      questionCount:
        generatedQuestions.questions.length,
    });

    /**
     * Save Assessment ID into Blueprint
     */
    blueprint.assessmentId =
      assessment.assessmentId;

    /**
     * Save Question Snapshot
     */
    const snapshotDocuments =
      generatedQuestions.questions.map(
        (question, index) => ({
          assessmentId:
            assessment.assessmentId,

          questionId:
            `Q${index + 1}`,

          ...question,
        })
      );

    await QuestionSnapshot.insertMany(
      snapshotDocuments
    );

    /**
     * Remove Correct Answers
     */
    const questionsForCandidate =
      generatedQuestions.questions.map(
        ({
          correctAnswer,
          explanation,
          ...question
        }) => question
      );

    /**
     * Return Assessment
     */
    return {
      assessmentId:
        assessment.assessmentId,

      durationMinutes:
        assessment.durationMinutes,

      questionCount:
        assessment.questionCount,

      questions:
        questionsForCandidate,
    };
  }

}

export default new AssessmentService();