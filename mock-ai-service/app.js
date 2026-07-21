import express from "express";
import cors from "cors";

import aiRoutes from "./src/routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Root Route
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "AI Mock Service",
    version: "1.0.0",
    message: "AI Mock Service is running successfully.",
    endpoints: {
      health: "/health",
      generate: "/generate",
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
    message: "AI Mock Service is healthy.",
    data: {
      service: "ai-mock-service",
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * AI Routes
 */
app.use("/", aiRoutes);

export default app;
