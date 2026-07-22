import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Assessment Service API",
      version: "1.0.0",
      description: "Assessment APIs for Placemux Assess",
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "YOUR_RENDER_URL"
            : "http://localhost:3004",

        description:
          process.env.NODE_ENV === "production"
            ? "Production"
            : "Development",
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
    },
  },

  apis: ["./src/docs/*.swagger.js"],
};

export default swaggerJsDoc(options);