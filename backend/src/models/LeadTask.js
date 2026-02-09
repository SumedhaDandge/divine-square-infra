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

  // 📅 Combined Date & Time (Crucial for sorting & cron)
  scheduledAt: {
    type: Date,
    required: true,
    index: true // ⚡ Index for fast cron queries
  },

  status: {
    type: String,
    enum: TASK_STATUS,
    default: "pending",
  },

  // 📝 SITE VISIT FEEDBACK
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    interestLevel: { 
      type: String, 
      enum: ["very_interested", "interested", "neutral", "not_interested"] 
    },
    notes: String,
    images: [String], // URLs
    layoutsVisited: [String], // IDs or Names of layouts
    attendeeCount: Number,
    revisitDate: Date,
    objections: [String],
  },

  // 🔔 REMINDER TRACKING
  remindersSent: {
    min15: { type: Boolean, default: false },
    min10: { type: Boolean, default: false },
    min5: { type: Boolean, default: false }
  },

  // 🏟️ SITE VISIT SPECIFIC
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Optional link to project
  pickupLocation: String,

  // 🔄 RESCHEDULE HISTORY
  rescheduleHistory: [{
    scheduledAt: Date,
    taskTime: String,
    reason: String,
    rescheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rescheduledAt: { type: Date, default: Date.now }
  }],

  completedAt: Date,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });


export const LeadTask = mongoose.model("LeadTask", leadTaskSchema);
