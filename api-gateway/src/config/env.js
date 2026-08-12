import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "PORT",
  "AUTH_SERVICE_URL",
  "USER_SERVICE_URL",
  "QUESTION_BANK_SERVICE_URL",
  "ASSESSMENT_SERVICE_URL",
  "EVALUATION_SERVICE_URL",
  "PROCTORING_SERVICE_URL",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.log(`${key} is missing from environment variables`);
    process.exit(1);
  }
});

export const env = {
  port: process.env.PORT || 3000,
  authServiceUrl: process.env.AUTH_SERVICE_URL,
  userServiceUrl: process.env.USER_SERVICE_URL,
  questionBankServiceUrl: process.env.QUESTION_BANK_SERVICE_URL,
  assessmentServiceUrl: process.env.ASSESSMENT_SERVICE_URL,
  evaluationServiceUrl: process.env.EVALUATION_SERVICE_URL,
  proctoringServiceUrl: process.env.PROCTORING_SERVICE_URL,
};
