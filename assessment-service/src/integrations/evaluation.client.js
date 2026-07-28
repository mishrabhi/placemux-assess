import axios from "axios";
import ApiError from "../utils/ApiError.js";

class EvaluationClient {
  async evaluateAssessment(accessToken, assessmentId) {
    try {
      const response = await axios.post(
        `${process.env.EVALUATION_SERVICE_URL}/api/evaluations/evaluate`,
        {
          assessmentId,
        },
        {
          timeout: Number(process.env.REQUEST_TIMEOUT),
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data ?? response.data;
    } catch (error) {
      console.error("Evaluation Service Error:", error.message);
      throw new ApiError(503, "Unable to evaluate assessment.");
    }
  }
}

export default new EvaluationClient();
