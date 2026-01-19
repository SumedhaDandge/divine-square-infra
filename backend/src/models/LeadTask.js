import mongoose from "mongoose";

export const TASK_TYPE = ["call", "site_visit", "revisit", "follow_up"];

export const TASK_STATUS = ["pending", "completed", "cancelled"];

const leadTaskSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    taskType: {
      type: String,
      enum: TASK_TYPE,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: TASK_STATUS,
      default: "pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",},

    completedAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const LeadTask = mongoose.model("LeadTask", leadTaskSchema);
