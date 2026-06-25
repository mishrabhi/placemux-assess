import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Placemux Assess Auth Service API",

      version: "1.0.0",

      description: "Authentication APIs for Placemux Assess",
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://placemux-assess-auth-service.onrender.com"
            : "http://localhost:3001",
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },

      schemas: {
        SuccessResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
            },

            message: {
              type: "string",
            },

            data: {
              type: "object",
            },
          },
        },

        ErrorResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: false,
            },

            message: {
              type: "string",
              example: "Validation failed",
            },
          },
        },
      },
    },
  },

  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
