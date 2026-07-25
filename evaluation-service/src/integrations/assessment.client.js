import axios from "axios";
import ApiError from "../utils/ApiError.js";

class AssessmentClient {
  /**
   * Fetch Assessment Data
   */
  async getAssessmentData(assessmentId, accessToken) {
    try {
      const response = await axios.get(
        `${process.env.ASSESSMENT_SERVICE_URL}/api/assessments/${assessmentId}`,

        {
          timeout: Number(process.env.REQUEST_TIMEOUT),

          headers: {
            Authorization: accessToken,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      console.error("Assessment Service Error:", error.message);

      throw new ApiError(503, "Unable to communicate with Assessment Service.");
    }
  }
}

export default new AssessmentClient();
