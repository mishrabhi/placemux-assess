import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Placemux API Gateway",
      version: "1.0.0",
      description: "Gateway API documentation for Placemux Assess",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.API_BASE_URL
            : "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Development Server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export default swaggerJsDoc(options);
