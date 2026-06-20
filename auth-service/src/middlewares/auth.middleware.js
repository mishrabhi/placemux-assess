import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const verifyJWT = (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyJWT;
