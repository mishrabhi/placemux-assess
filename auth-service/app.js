import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import swaggerUi from "swagger-ui-express";
import authRoutes from "./src/routes/auth.routes.js";
import { errorHandler } from './src/middlewares/error.middleware.js';
import swaggerSpec from "./src/docs/swagger.js";
import ApiResponse from "./src/utils/apiResponse.js"


const app = express();

//Global middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

//Health Check
app.get("/health", (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                service: "auth-service",
                timestamp: new Date().toISOString()
            },
            "auth-service is healthy"
        )
    );
});

//swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

//routes
app.use("/api/auth", authRoutes)

//Error Handling
app.use(errorHandler)

export default app;