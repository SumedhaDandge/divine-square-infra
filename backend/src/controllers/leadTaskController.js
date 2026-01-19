import { createLeadTaskService ,listLeadTasksService , listAllTasksService } from "../services/leadTaskService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createLeadTask = async (req, res) => {
  try {
    const result = await createLeadTaskService(req.body, req.user.id);
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};



export const listTasksByLead = async (req, res) => {
  try {
    const result = await listLeadTasksService(req.params.leadId);
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};


export const listAllTasks = async (req, res) => {
  try {
    const result = await listAllTasksService(req.query);
    return successResponse(res, 200, "Tasks fetched successfully", result);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
