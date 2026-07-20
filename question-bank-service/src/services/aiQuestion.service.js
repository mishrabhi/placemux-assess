import Skill from "../models/skill.model.js";
import AIMLClient from "../integrations/aiml.client.js";
import ApiError from "../utils/ApiError.js";

//AI questions generation
class AIQuestionService {
  async generateQuestions(payload) {
    const {
      assessmentId,
      candidateId,
      skills,
      experienceLevel,
      difficulty,
      distribution,
    } = payload;

    // Validate Skills
    const existingSkills = await Skill.find({
      name: {
        $in: skills.map((skill) => skill.skillName),
      },
      isActive: true,
    });

    if (existingSkills.length !== skills.length) {
      throw new ApiError(400, "One or more selected skills are invalid.");
    }

    // Prepare AI Request
    const aiPayload = {
      assessmentId,
      candidateId,
      skills,
      experienceLevel,
      difficulty,
      distribution,
    };

    // Generate Questions
    const aiResponse = await AIMLClient.generateQuestions(aiPayload);

    // Validate AI Response
    this.validateAIResponse(aiResponse);

    // Normalize Questions
    const normalizedQuestions = this.normalizeQuestions(aiResponse.questions);

    return {
      assessmentId,
      candidateId,
      totalQuestions: normalizedQuestions.length,
      questions: normalizedQuestions,
    };
  }

  validateAIResponse(response) {
    if (!response) {
      throw new ApiError(500, "AI Service returned an empty response.");
    }

    if (!Array.isArray(response.questions)) {
      throw new ApiError(500, "Invalid response received from AI Service.");
    }

    if (response.questions.length === 0) {
      throw new ApiError(500, "AI Service generated zero questions.");
    }
  }

  normalizeQuestions(questions) {
    return questions.map((question) => ({
      type: question.type,

      difficulty: question.difficulty,

      experienceLevel: question.experienceLevel,

      questionText: question.questionText,

      options: question.options || [],

      correctAnswer: question.correctAnswer,

      explanation: question.explanation || "",

      maxScore: question.maxScore || 10,

      timeLimitSeconds: question.timeLimitSeconds || 60,

      codingMeta: question.codingMeta || null,

      source: "AI",

      generatedBy: question.generatedBy || "Unknown",

      modelVersion: question.modelVersion || "1.0",

      confidence: question.confidence || null,
    }));
  }
}

export default new AIQuestionService();
