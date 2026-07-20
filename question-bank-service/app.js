import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";
import successResponse from "./src/utils/ApiResponse.js"
import skillRoutes from "./src/routes/skill.routes.js";
import aiQuestionRoutes from "./src/routes/aiQuestion.routes.js";

import {
  errorHandler,
  notFoundHandler,
} from "./src/middlewares/error.middleware.js";

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(morgan("dev"));

//swagger api-doc
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

//server check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Question Bank Service",
    version: "2.0.0",
    architecture: "AI Powered",
    endpoints: {
      skills: "/api/skills",
      docs: "/api-docs",
      health: "/health",
    },
    timestamp: new Date().toISOString(),
  });
});

//health check route
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Question Bank Service is healthy",
    data: {
      service: "question-bank-service",
      timestamp: new Date().toISOString(),
    },
  });
});

//routes
app.use("/api/skills", skillRoutes);

//Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
