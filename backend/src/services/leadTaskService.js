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
    .populate("project", "projectName name location")
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
    .populate("project", "projectName name location")
    .sort({ scheduledAt: 1 }); // ✅ Fixed sort

  return tasks;
  return tasks;
};

export const updateLeadTaskService = async (taskId, updates, userId) => {
    const task = await LeadTask.findById(taskId);
    if (!task) throw new Error("Task not found");

    // 🔄 Handle Rescheduling
    if (updates.rescheduleReason) {
        task.rescheduleHistory.push({
            scheduledAt: task.scheduledAt,
            taskTime: task.taskTime,
            reason: updates.rescheduleReason,
            rescheduledBy: userId, // Track who did it
            rescheduledAt: new Date(),
        });
        
        // Reset status if it was somehow strictly completed/cancelled (though usually we reschedule pending)
        if (task.status !== 'pending') task.status = 'pending';
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
        // Prevent overwriting history or protected fields if necessary
        if (key !== 'rescheduleHistory' && key !== '_id') {
            task[key] = updates[key];
        }
    });

    // 🕒 Recalculate scheduledAt if date/time changed
    if (updates.taskDate && updates.taskTime) {
         const d = new Date(updates.taskDate);
         // Support "24:00" or "12:00 PM" formats
         const timeMatch = updates.taskTime.match(/(\d+):(\d+)\s?(AM|PM)?/i);
         if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            const meridiem = timeMatch[3];
            if (meridiem) {
                if (meridiem.toUpperCase() === "PM" && hours < 12) hours += 12;
                if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;
            } else {
                // 24h format support if input[type=time] sends it
                // Input time sends "HH:mm" (24h).
            }
            d.setHours(hours, minutes, 0, 0);
            task.scheduledAt = d;
         }
    }

    // 🤖 Auto-schedule Revisit if feedback contains revisitDate
    if (updates.feedback?.revisitDate) {
        const revisitDate = new Date(updates.feedback.revisitDate);
        // Default to 11 AM next day or same day
        revisitDate.setHours(11, 0, 0, 0);

        // Check if a revisit task already exists for this date/lead to prevent duplicates? 
        // For now, allow it.
        await LeadTask.create({
            lead: task.lead,
            assignedTo: task.assignedTo,
            taskType: "revisit",
            remark: `Follow-up from site visit (Feedback)`,
            taskDate: revisitDate,
            taskTime: "11:00 AM",
            scheduledAt: revisitDate,
            createdBy: userId || task.createdBy,
        });
    }

    await task.save();
    return task;
};

