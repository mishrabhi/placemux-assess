import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "PORT",
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "SERVICE_TOKEN",
  "ASSESSMENT_SERVICE_URL",
  "REQUEST_TIMEOUT",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.log(`${key} is missing from environment variables`);
    process.exit(1);
  }
});

export const env = {
  port: process.env.PORT || 3005,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_ACCESS_SECRET,
  serviceToken: process.env.SERVICE_TOKEN,
  assessmentServiceUrl: process.env.ASSESSMENT_SERVICE_URL,
  requestTimeout: Number(process.env.REQUEST_TIMEOUT) || 5000,
};
