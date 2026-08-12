import axios from "axios";
import ApiError from "../middlewares/apiError.middleware.js";

export const forwardRequest = async (req, res, targetUrl) => {
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: undefined,
      },
      data: req.body,
      params: req.query,
      timeout: 10000,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(502).json({
      success: false,
      message: "Bad gateway",
    });
  }
};
