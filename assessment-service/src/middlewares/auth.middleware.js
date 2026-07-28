import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access token is required.");
    }

    if (process.env.SERVICE_TOKEN && token === process.env.SERVICE_TOKEN) {
      req.user = { role: "admin", userId: "service" };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized access."));
  }
};

export default auth;
