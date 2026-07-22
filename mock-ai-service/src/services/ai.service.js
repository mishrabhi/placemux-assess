import { generateMockQuestions } from "../utils/questionGenerator.js";

class AIService {
  //generate Questions
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

  //Evaluate Assessment
  async evaluateAssessment(payload) {
    const {
      questions,

      answers,
    } = payload;

    let totalScore = 0;

    let maxScore = 0;

    let mcqScore = 0;

    let technicalScore = 0;

    let codingScore = 0;

    const details = [];

    questions.forEach((question) => {
      const answer = answers.find((a) => a.questionId === question.questionId);

      let obtained = 0;

      let status = "incorrect";

      let feedback = "";

      /**
       * MCQ
       */
      if (question.type === "mcq") {
        if (answer && answer.selectedAnswer === question.correctAnswer) {
          obtained = question.maxScore;

          status = "correct";

          feedback = "Correct Answer.";
        }

        mcqScore += obtained;
      } else if (question.type === "technical") {

      /**
       * Technical
       */
        if (answer && answer.selectedAnswer) {
          obtained = Math.floor(question.maxScore * 0.8);

          status = "partial";

          feedback = "Mock AI Evaluation.";
        }

        technicalScore += obtained;
      } else {

      /**
       * Coding
       */
        if (answer && answer.codingSubmission) {
          obtained = question.maxScore;

          status = "correct";

          feedback = "Mock Coding Evaluation.";
        }

        codingScore += obtained;
      }

      totalScore += obtained;

      maxScore += question.maxScore;

      details.push({
        questionId: question.questionId,

        questionType: question.type,

        candidateAnswer:
          answer?.selectedAnswer || answer?.codingSubmission || "",

        correctAnswer: question.correctAnswer,

        obtainedScore: obtained,

        maxScore: question.maxScore,

        status,

        feedback,
      });
    });

    return {
      scores: {
        mcq: {
          obtained: mcqScore,
          maximum: 50,
        },

        technical: {
          obtained: technicalScore,

          maximum: 30,
        },

        coding: {
          obtained: codingScore,

          maximum: 20,
        },
      },

      totalScore,

      maxScore,

      percentage: Math.round((totalScore / maxScore) * 100),

      passed: totalScore >= maxScore * 0.4,

      details,
    };
  }
}

export default new AIService();
