import { Lead } from "../models/Lead.js";
import { LeadTask } from "../models/LeadTask.js";
import mongoose from "mongoose";

export const createLeadTaskService = async (payload, userId) => {
  // ✅ Check Lead exists
  const leadExists = await Lead.findById(payload.lead);
  if (!leadExists) {
    return {
      statusCode: 404,
      message: "Lead not found",
    };
  }

  // ✅ Check Assigned User exists
  const userExists = await User.findById(payload.assignedTo);
  if (!userExists) {
    return {
      statusCode: 404,
      message: "Assigned user not found",
    };
  }

  // ✅ Create task
  const task = await LeadTask.create({
    lead: payload.lead,
    assignedTo: payload.assignedTo,
    taskType: payload.taskType,
    remark: payload.remark,
    taskDate: payload.taskDate,
    taskTime: payload.taskTime,
    createdBy: userId,
  });

  return {
    statusCode: 201,
    message: "Task created successfully",
    data: task,
  };
};



export const listLeadTasksService = async (leadId) => {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new Error("Invalid lead id");
  }

  const tasks = await LeadTask.find({ lead: leadId })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name")
    .sort({ dueDate: 1 });

  return {
    statusCode: 200,
    message: "Lead tasks fetched successfully",
    data: tasks,
  };
};



export const listAllTasksService = async (query, userId) => {
  const filter = {};

  // Status filter
  if (query.status) filter.status = query.status;

  // Task type filter
  if (query.taskType) filter.taskType = query.taskType;

  // Assigned to
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  // 🔥 Logged-in user (important for dashboard)
  if (query.mine === "true") {
    filter.$or = [
      { assignedTo: userId },
      { createdBy: userId },
    ];
  }

  // 🔥 Today filter
  if (query.today === "true") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    filter.dueDate = { $gte: start, $lte: end };

    // Dashboard usually wants pending only
    filter.status = "pending";
  }

  const tasks = await LeadTask.find(filter)
    .populate("lead", "customerName mobile")
    .populate("assignedTo", "name")
    .sort({ dueDate: 1 });

  return tasks;
};
