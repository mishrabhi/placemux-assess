import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";
import proctoringRoutes from "./src/routes/proctoring.routes.js";
import { errorHandler, notFoundHandler } from "./src/middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "Proctoring Service",
    version: "1.0.0",
    health: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/proctoring", proctoringRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
