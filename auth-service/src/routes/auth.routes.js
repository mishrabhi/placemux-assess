import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  signup,
  login,
  refreshToken,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/signup", validate("signup"), signup);
router.post("/login", validate("login"), login);
router.post("/refresh", validate("refresh"), refreshToken);
router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", validate("logout"), logout);

export default router;
