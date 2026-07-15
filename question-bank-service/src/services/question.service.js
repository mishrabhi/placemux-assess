import Question from "../models/question.model.js";
import ApiError from "../utils/ApiError.js";

class QuestionService {

  /**
   * Create Question (Manual)
   */
  async createQuestion(payload) {

    const exists = await Question.findOne({
      skillId: payload.skillId,
      questionText: payload.questionText,
    });

    if (exists) {
      throw new ApiError(
        409,
        "Question already exists"
      );
    }

    payload.source = "MANUAL";
    payload.approvalStatus = "approved";

    return await Question.create(payload);
  }

  /**
   * Bulk Import AI Questions
   */
  async importAIQuestions(questions) {

    const imported = [];
    const duplicates = [];

    for (const question of questions) {

      const exists = await Question.findOne({
        skillId: question.skillId,
        questionText: question.questionText,
      });

      if (exists) {
        duplicates.push(question.questionText);
        continue;
      }

      imported.push({
        ...question,

        source: "AI",

        approvalStatus: "pending",

        importedAt: new Date(),
      });

    }

    if (imported.length > 0) {
      await Question.insertMany(imported);
    }

    return {
      imported: imported.length,
      duplicates: duplicates.length,
      duplicateQuestions: duplicates,
    };
  }

  /**
   * Approve AI Question
   */
  async approveQuestion(questionId, approvedBy) {

    const question =
      await Question.findById(questionId);

    if (!question) {
      throw new ApiError(
        404,
        "Question not found"
      );
    }

    question.approvalStatus = "approved";

    question.approvedBy = approvedBy;

    question.approvedAt = new Date();

    await question.save();

    return question;
  }

  /**
   * Reject AI Question
   */
  async rejectQuestion(questionId) {

    const question =
      await Question.findById(questionId);

    if (!question) {
      throw new ApiError(
        404,
        "Question not found"
      );
    }

    question.approvalStatus = "rejected";

    await question.save();

    return question;
  }

  /**
   * Pending AI Questions
   */
  async getPendingQuestions() {

    return await Question.find({

      source: "AI",

      approvalStatus: "pending",

      isActive: true,

    });

  }

  /**
   * Questions by Skill
   */
  async getQuestionsBySkill(skillId) {

    return await Question.find({

      skillId,

      approvalStatus: "approved",

      isActive: true,

    }).select("-correctAnswer");

  }

  /**
   * Filter Questions
   */
  async getFilteredQuestions({

    skillId,

    type,

    difficulty,

    experienceLevel,

  }) {

    const filter = {

      approvalStatus: "approved",

      isActive: true,

      experienceLevel: {
        $in: [
          experienceLevel,
          "both",
        ],
      },

    };

    if (skillId) {
      filter.skillId = skillId;
    }

    if (type) {
      filter.type = type;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    return await Question.find(filter)
      .select(
        "-correctAnswer -codingMeta.testCases"
      );

  }

  /**
   * Delete Question
   */
  async deleteQuestion(questionId) {

    const question =
      await Question.findById(questionId);

    if (!question) {

      throw new ApiError(
        404,
        "Question not found"
      );

    }

    question.isActive = false;

    await question.save();

    return question;

  }

}

export default new QuestionService();