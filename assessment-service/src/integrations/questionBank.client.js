import axios from "axios";
import ApiError from "../utils/ApiError.js";

class QuestionBankClient {
  async generateQuestions(accessToken, payload) {
    console.log("Question Bank URL:");
    console.log(
      `${process.env.QUESTION_BANK_SERVICE_URL}/api/questions/generate`,
    );

    console.log("Payload:");
    console.log(JSON.stringify(payload, null, 2));
    try {
      const response = await axios.post(
        `${process.env.QUESTION_BANK_SERVICE_URL}/api/questions/generate`,
        payload,
        {
          timeout: Number(process.env.REQUEST_TIMEOUT),

          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data ?? response.data;
    } catch (error) {
      
      console.error("Question Bank Service Error:", error.message);

      throw new ApiError(503, "Unable to generate questions.");
    }
  }
}

export default new QuestionBankClient();
