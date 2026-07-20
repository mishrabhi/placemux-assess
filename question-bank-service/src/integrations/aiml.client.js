import axios from "axios";
import ApiError from "../utils/ApiError.js";

class AIMLClient {
  async generateQuestions(payload) {
    try {
      const response = await axios.post(
        `${process.env.AI_BASE_URL}${process.env.AI_GENERATE_ENDPOINT}`,
        payload,
        {
          timeout: Number(process.env.AI_TIMEOUT),

          headers: {
            Authorization: `Bearer ${process.env.AI_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("AI Service Error:", error.message);

      throw new ApiError(
        503,
        "Unable to communicate with AI Question Generation Service",
      );
    }
  }
}

export default new AIMLClient();
