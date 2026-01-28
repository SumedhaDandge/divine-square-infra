import { Lead } from "../models/Lead.js";
import { LeadTask } from "../models/LeadTask.js";
import mongoose from "mongoose";
import User from '../models/User.js'

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

  // 🕒 Calculate scheduledAt from Date and Time
  let scheduledAt = new Date();
  if (payload.taskDate && payload.taskTime) {
    const d = new Date(payload.taskDate);
    // Parse "11:45 PM" or "11:45 AM"
    const timeMatch = payload.taskTime.match(/(\d+):(\d+)\s?(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const meridiem = timeMatch[3];

      if (meridiem) {
          if (meridiem.toUpperCase() === "PM" && hours < 12) hours += 12;
          if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;
      }
      
      d.setHours(hours, minutes, 0, 0);
      scheduledAt = d;
    }
  }

  // ✅ Create task
  const task = await LeadTask.create({
    lead: payload.lead,
    assignedTo: payload.assignedTo,
    taskType: payload.taskType,
    remark: payload.remark,
    taskDate: payload.taskDate,
    taskTime: payload.taskTime,
    scheduledAt: scheduledAt,
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
    .sort({ scheduledAt: 1 }); // 📅 Sorted by schedule

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

    filter.scheduledAt = { $gte: start, $lte: end }; // ✅ Fixed field

    // Dashboard usually wants pending only
    filter.status = "pending";
  }

  const tasks = await LeadTask.find(filter)
    .populate("lead", "customerName mobile")
    .populate("assignedTo", "name")
    .sort({ scheduledAt: 1 }); // ✅ Fixed sort

  return tasks;
};
