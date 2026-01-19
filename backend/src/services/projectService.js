import Project from "../models/Project.js";
import { validateMastersExist } from "./common/projectValidation.js"


export const createProjectService = async (payload, userId) => {
  const masterError = await validateMastersExist(payload);
  if (masterError) return masterError;

  const existingProject = await Project.findOne({
    projectName: payload.projectName,
  });

  if (existingProject) {
    return {
      statusCode: 409,
      message: "Project with this name already exists",
    };
  }

  const project = await Project.create({
    ...payload,
    createdBy: userId,
  });

  return {
    statusCode: 201,
    message: "Project created successfully",
    data: project,
  };
};

export const listProjectsService = async () => {
  const projects = await Project.find()
    .populate("createdBy", "name email role")
    .populate({
      path: "amenities",
      select: "name icon status",
    })
    .populate({
      path: "nearbyDevelopments",
      select: "name status",
    })
    .sort({ createdAt: -1 });

  return projects;
};

export const updateProjectService = async (projectId, payload) => {
  const masterError = await validateMastersExist(payload);
  if (masterError) return masterError;

  if (payload.projectName) {
    const existing = await Project.findOne({
      projectName: payload.projectName,
      _id: { $ne: projectId },
    });

    if (existing) {
      return {
        statusCode: 409,
        message: "Project with this name already exists",
      };
    }
  }

  const project = await Project.findByIdAndUpdate(projectId, payload, {
    new: true,
    runValidators: true,
  })
    .populate("amenities")
    .populate("nearbyDevelopments");

  if (!project) {
    return {
      statusCode: 404,
      message: "Project not found",
    };
  }

  return {
    statusCode: 200,
    message: "Project updated successfully",
    data: project,
  };
};

