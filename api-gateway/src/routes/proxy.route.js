import express from "express";
import { env } from "../config/env.js";
import { forwardRequest } from "../utils/httpProxy.js";

const router = express.Router();

const serviceMap = {
  auth: env.authServiceUrl,
  users: env.userServiceUrl,
  questions: env.questionBankServiceUrl,
  assessments: env.assessmentServiceUrl,
  evaluations: env.evaluationServiceUrl,
  proctoring: env.proctoringServiceUrl,
};

const serviceProxy = (serviceUrl) => {
  return async (req, res, next) => {
    const path = req.originalUrl.replace(/^\/api\//, "");
    const targetUrl = `${serviceUrl}/${path}`;
    await forwardRequest(req, res, targetUrl);
  };
};

router.use("/auth", serviceProxy(serviceMap.auth));
router.use("/users", serviceProxy(serviceMap.users));
router.use("/questions", serviceProxy(serviceMap.questions));
router.use("/assessments", serviceProxy(serviceMap.assessments));
router.use("/evaluations", serviceProxy(serviceMap.evaluations));
router.use("/proctoring", serviceProxy(serviceMap.proctoring));

export default router;
