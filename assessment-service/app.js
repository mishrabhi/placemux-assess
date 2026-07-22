import express from "express";
import cors from "cors";
import assessmentRoutes from "./src/routes/assessment.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import notFound from "./src/middlewares/notFound.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

/**
 * Swagger Route
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

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

app.use("/api/assessments", assessmentRoutes);

//Global Error handling
app.use(notFound);
app.use(errorHandler);

export default app;