import mongoose from "mongoose";

export const TASK_TYPE = [
  "call",
  "whatsapp",
  "site_visit",
  "revisit",
  "follow_up",
  "booking",
];

export const TASK_STATUS = ["pending", "completed", "cancelled"];

const leadTaskSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  taskType: {
    type: String,
    enum: TASK_TYPE,
    required: true,
  },

  remark: {
    type: String,
    required: true,
    trim: true,
  },

  taskDate: {
    type: Date, // DATE ONLY
    required: true,
  },

  taskTime: {
    type: String, // "11:45 PM"
    required: true,
  },

  status: {
    type: String,
    enum: TASK_STATUS,
    default: "pending",
  },

  // 🔔 NEW FIELD
  reminderSent: {
    type: Boolean,
    default: false,
  },

  completedAt: Date,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });


export const LeadTask = mongoose.model("LeadTask", leadTaskSchema);
