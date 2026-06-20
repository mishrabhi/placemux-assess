import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import authRoutes from "./src/routes/auth.routes.js";
import { errorHandler } from './src/middlewares/error.middleware.js';


const app = express();

//Global middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

//Health Check
app.get('/health', (req, res) => {
  return successResponse(res, {
    statusCode: 200,
    message: 'auth-service is healthy',
    data: { service: 'auth-service', timestamp: new Date().toISOString() },
  });
});

//routes
app.use("/api/auth", authRoutes)

//Error Handling
app.use(errorHandler)

export default app;