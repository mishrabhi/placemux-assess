import Question from "../models/question.model.js";
import ApiError from "../utils/ApiError.js";

class QuestionService {
// create questions
  async createQuestion(payload) {
    return await Question.create(payload);
  }

// get questions by user skills
  async getQuestionsBySkill(skillId) {
    const questions = await Question.find({
      skillId,
    });

    return questions;
  }

// get filtered questions
  async getFilteredQuestions({ skillId, type, difficulty, experienceLevel }) {
    return await Question.find({
      skillId,

      type,

      difficulty,

      experienceLevel: {
        $in: [experienceLevel, "both"],
      },
    }).select("-correctAnswer -codingMeta.testCases");
  }
}

export default new QuestionService();
