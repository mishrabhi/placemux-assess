import skillService from "../services/skill.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

//create user skill
export const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, skill, "Skill created successfully"));
});

//get all skills of single user
export const getAllSkills = asyncHandler(async (req, res) => {
  const skills = await skillService.getAllSkills();

  res.status(200).json(new ApiResponse(200, skills));
});

//delete skill of a user
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.deleteSkill(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill deleted successfully"));
});
