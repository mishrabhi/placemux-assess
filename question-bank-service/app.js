import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import skillRoutes from "./src/routes/skill.routes.js";
import questionRoutes from "./src/routes/question.routes.js";

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

//health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "question-bank-service",
  });
});

//routes
app.use("/api/skills", skillRoutes);
app.use("/api/questions", questionRoutes);

//Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
