import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import authRoutes from "./src/routes/auth.routes.js";


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes)

export default app;