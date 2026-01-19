import { Lead } from "../models/Lead.js";
import { LeadTask } from "../models/LeadTask.js";
import mongoose from "mongoose";

export const createLeadTaskService = async (payload, userId) => {
  // ✅ Check lead exists
  const lead = await Lead.findById(payload.lead);
  if (!lead) {
    throw new Error("Lead not found");
  }

  // ✅ Validate dueDate exists
  if (!payload.dueDate) {
    throw new Error("Due date is required");
  }

  // ✅ Normalize date
  const dueDate = new Date(payload.dueDate);

  if (isNaN(dueDate.getTime())) {
    throw new Error("Invalid due date");
  }

  // ✅ BACK DATE VALIDATION (IST BUSINESS LOGIC)
  const now = new Date();

  // Compare only by time (not milliseconds noise)
  if (dueDate < now) {
    throw new Error("Back-dated tasks are not allowed");
  }

  const task = await LeadTask.create({
    ...payload,
    dueDate,
    createdBy: userId,
    assignedTo: payload.assignedTo || userId
  });

  return {
    statusCode: 201,
    message: "Task created successfully",
    data: task
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

export const listAllTasksService = async (query) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.taskType) filter.taskType = query.taskType;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  // ✅ TODAY FILTER (UTC SAFE)
  if (query.today === "true") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    filter.dueDate = { $gte: start, $lte: end };
  }

  console.log("QUERY PARAMS:", query);
  console.log("FINAL FILTER:", filter);

  const tasks = await LeadTask.find(filter)
    .populate("lead", "customerName mobile")
    .populate("assignedTo", "name")
    .sort({ dueDate: 1 });

  return tasks;
};
