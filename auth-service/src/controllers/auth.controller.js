import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js"

//signup
export const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//login
export const login = async (req, res) => {
  try {
    const tokens = await authService.login(req.body);

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

//refreshToken
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const accessToken = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

//get authenticated user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);

  res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

//logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
