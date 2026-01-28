import { createLeadTaskService ,listLeadTasksService , listAllTasksService } from "../services/leadTaskService.js";
import { successResponse, errorResponse } from "../utils/response.js";
import User from "../models/User.js"
import { sendFcmNotification } from "../utils/sendFcm.js";
import { LeadTask } from "../models/LeadTask.js";


export const createLeadTask = async (req, res) => {
  try {
    const result = await createLeadTaskService(req.body, req.user.id);

    if (!result.data) {
      return errorResponse(res, result.statusCode, result.message);
    }

    const task = result.data;

    try {
      const user = await User.findById(task.assignedTo).select("fcmToken");

      if (user?.fcmToken) {
        await sendFcmNotification({
          token: user.fcmToken,
          title: "New Task Assigned",
          body: `${task.taskType.toUpperCase()} • ${task.remark}`,
          data: {
            taskId: task._id.toString(),
            type: "TASK_CREATED",
          },
        });
      }
    } catch (fcmError) {
      console.error("FCM Error:", fcmError.message);
      // ❗ DO NOT throw
    }

    return successResponse(res, 201, "Task created", task);
  } catch (error) {
    return errorResponse(res, 500, error.message);
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
    const result = await listAllTasksService(req.query, req.user._id);
    return successResponse(res, 200, "Tasks fetched successfully", result);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};



export const completeTask = async (req, res) => {
  try {
    const { remark } = req.body;

    const task = await LeadTask.findById(req.params.taskId);

    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }

    task.status = "completed";
    task.completedAt = new Date();

    if (remark) {
      task.description = remark;
    }

    await task.save();

    return successResponse(res, 200, "Task completed successfully", task);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};


export const cancelTask = async (req, res) => {
    try {
      const task = await LeadTask.findById(req.params.taskId);
      if (!task) return errorResponse(res, 404, "Task not found");
      
      task.status = "cancelled";
      await task.save();
      
      return successResponse(res, 200, "Task cancelled", task);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  };
