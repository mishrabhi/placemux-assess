import axios from "axios";
import ApiError from "../utils/ApiError.js";

class UserClient {
  async getCandidateProfile(accessToken) {
    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/users/profile`,
        {
          timeout: Number(process.env.REQUEST_TIMEOUT),

          headers: {
            Authorization: accessToken,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      console.error("User Service Error:", error.message);

      throw new ApiError(
        503,
        "Unable to fetch candidate profile from User Service.",
      );
    }
  }
}

export default new UserClient();
