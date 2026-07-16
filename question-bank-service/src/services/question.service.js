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
      throw new ApiError(409, "Question already exists");
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
    const question = await Question.findById(questionId);

    if (!question) {
      throw new ApiError(404, "Question not found");
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
    const question = await Question.findById(questionId);
    if (!question) {
      throw new ApiError(404, "Question not found");
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
    if (experienceLevel) {

    filter.experienceLevel = {
    $in: [
      experienceLevel,
      "both",
     ],
    };
  }
    return await Question.find(filter).select(
      "-correctAnswer -codingMeta.testCases",
    );
  }

  /**
   * Delete Question
   */
  async deleteQuestion(questionId) {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new ApiError(404, "Question not found");
    }

    question.isActive = false;

    await question.save();

    return question;
  }

  /**
   * Get Question By ID
   */
  async getQuestionById(questionId) {
    const question = await Question.findById(questionId);

    if (!question || !question.isActive) {
      throw new ApiError(404, "Question not found");
    }
    return question;
  }

  /**
   * Update Question
   */
  async updateQuestion(questionId, payload) {
    const question = await Question.findById(questionId);

    if (!question || !question.isActive) {
      throw new ApiError(404, "Question not found");
    }

    const duplicate = await Question.findOne({
      _id: {
        $ne: questionId,
      },
      skillId: payload.skillId,
      questionText: payload.questionText,
    });

    if (duplicate) {
      throw new ApiError(409, "Question already exists");
    }

    Object.assign(question, payload);
    await question.save();
    return question;
  }

  /**
   * Bulk Approve Questions
   */
  async bulkApproveQuestions(questionIds, approvedBy) {
    const result = await Question.updateMany(
      {
        _id: {
          $in: questionIds,
        },
        approvalStatus: "pending",
      },

      {
        approvalStatus: "approved",
        approvedBy,
        approvedAt: new Date(),
      },
    );

    return {
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * Bulk Reject Questions
   */
  async bulkRejectQuestions(questionIds) {
    const result = await Question.updateMany(
      {
        _id: {
          $in: questionIds,
        },

        approvalStatus: "pending",
      },

      {
        approvalStatus: "rejected",
      },
    );

    return {
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * Search Questions
   */
  async searchQuestions(search) {
    return await Question.find({
      $text: {
        $search: search,
      },

      isActive: true,
    }).select("-correctAnswer");
  }

  /**
   * Random Questions
   */
  async getRandomQuestions({
    skillId,
    difficulty,
    experienceLevel,
    type,
    count,
  }) {
    return await Question.aggregate([
      {
        $match: {
          skillId,
          approvalStatus: "approved",
          isActive: true,
          difficulty,
          type,
          experienceLevel: {
            $in: [experienceLevel, "both"],
          },
        },
      },

      {
        $sample: {
          size: Number(count),
        },
      },

      {
        $project: {
          correctAnswer: 0,

          "codingMeta.testCases": 0,
        },
      },
    ]);
  }
}

export default new QuestionService();
