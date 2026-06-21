import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import userRoutes from "./src/routes/user.route.js";

import {
  errorHandler,
  notFoundHandler,
} from "./src/middlewares/error.middleware.js";

const app = express();

//Global middlewarews
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(morgan("dev"));

//Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "user-service",
  });
});

//routes
app.use("/api/users", userRoutes);

//Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
