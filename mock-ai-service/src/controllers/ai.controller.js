import AIService from "../services/ai.service.js";

export const generateQuestions = async (req, res) => {
  try {
    const result = await AIService.generateQuestions(req.body);
    return res.status(200).json({
      success: true,
      message: "Questions generated successfully.",
      ...result,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate questions.",
    });
  }
};