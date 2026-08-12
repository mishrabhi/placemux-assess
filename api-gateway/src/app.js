import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";
import { env } from "./config/env.js";
import apiErrorHandler from "./middlewares/apiError.middleware.js";
import proxyRoutes from "./routes/proxy.route.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", proxyRoutes);

app.use(apiErrorHandler);

export default app;
