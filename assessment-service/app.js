import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

/**
 * Root Route
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "Assessment Service",
    version: "1.0.0",
    message: "Assessment Service is running successfully.",
    endpoints: {
      health: "/health",
      docs: "/api-docs",
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Health Route
 */
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Assessment Service is healthy.",
    data: {
      service: "assessment-service",
      timestamp: new Date().toISOString(),
    },
  });
});

export default app;