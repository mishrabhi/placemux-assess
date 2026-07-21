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
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      if (error.request) {
        console.log("No response received from AI service.");
      }

      throw new ApiError(
        503,
        "Unable to communicate with AI Question Generation Service",
      );
    }
  }
}

export default new AIMLClient();
