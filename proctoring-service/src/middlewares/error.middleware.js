import ApiError from "../utils/ApiError.js";

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Resource not found",
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
