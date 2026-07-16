import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Placemux Question Bank Service API",
      version: "1.0.0",
      description:
        "Question Bank Service APIs for Placemux Assessment Platform",
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.API_BASE_URL
            : "http://localhost:3003",

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
              example: true,
            },

            statusCode: {
              type: "number",
              example: 200,
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
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/docs/*.swagger.js",
  ],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;