import axios from "axios";
import ApiError from "../utils/ApiError.js";

class AIClient {

  async evaluateAssessment(accessToken, payload) {

    try {

      const response = await axios.post(

        `${process.env.AI_SERVICE_URL}/evaluate`,

        payload,

        {
          timeout: Number(process.env.REQUEST_TIMEOUT),

          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        }

      );

      return response.data.data;

    } catch (error) {

      console.error(
        "AI Service Error:",
        error.message
      );

      throw new ApiError(
        503,
        "Unable to communicate with AI Evaluation Service."
      );

    }

  }

}

export default new AIClient();