import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";
import userRoutes from "./src/routes/user.route.js";
import {
  errorHandler,
  notFoundHandler,
} from "./src/middlewares/error.middleware.js";
import ApiResponse from "./src/utils/ApiResponse.js"

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
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                service: "user-service",
                timestamp: new Date().toISOString()
            },
            "user-service is healthy"
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
app.use("/api/users", userRoutes);

//Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
