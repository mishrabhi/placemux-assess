import userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

// Get user profile
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.userId);

  res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

//Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user.userId, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile updated successfully"));
});

//Add User skills
export const addSkills = asyncHandler(async (req, res) => {
  const profile = await userService.addSkills(req.user.userId, req.body.skills);

  res
    .status(200)
    .json(new ApiResponse(200, profile, "Skills added successfully"));
});
