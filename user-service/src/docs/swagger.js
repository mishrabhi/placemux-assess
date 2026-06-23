import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Placemux Assess User Service API",

      version: "1.0.0",

      description: "User Profile APIs",
    },

    servers: [
      {
        url: "http://localhost:3002",
        description: "Development Server",
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

  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
