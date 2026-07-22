import express from "express";
import cors from "cors";
import notFound from "./src/middlewares/notFound.middleware";
import errorHandler from "./src/middlewares/error.middleware";
import evaluationRoutes from "./src/routes/evaluation.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";

const app = express();

app.use(cors());

app.use(express.json());

/**
 * Swagger Route
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/**
 * Root Route
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "Evaluation Service",
    version: "1.0.0",
    message: "Evaluation Service is running successfully.",
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
    message: "Evaluation Service is healthy.",
    data: {
      service: "evaluation-service",
      timestamp: new Date().toISOString(),
    },
  });
});

//Routes
app.use("/api/evaluations", evaluationRoutes);

//Global Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
