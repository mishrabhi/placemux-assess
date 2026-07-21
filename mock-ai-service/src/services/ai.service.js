import { generateMockQuestions } from "../utils/questionGenerator.js";

class AIService {
  async generateQuestions(payload) {
    const {
      assessmentId,
      candidateId,
      skills,
      experienceLevel,
      difficulty,
      distribution,
    } = payload;

    const questions = generateMockQuestions({
      skills,
      experienceLevel,
      difficulty,
      distribution,
    });


    return {
      assessmentId,
      candidateId,
      totalQuestions: questions.length,
      questions,
    };
  }
}

export default new AIService();
