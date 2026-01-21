import { body } from "express-validator";
import { TASK_TYPE } from "../models/LeadTask.js";

export const createLeadTaskValidator = [
  body("lead")
    .notEmpty()
    .withMessage("Lead is required"),

  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned user is required"),

  body("taskType")
    .isIn(TASK_TYPE)
    .withMessage("Invalid task type"),

  body("remark")
    .notEmpty()
    .withMessage("Remark is required"),

  body("taskDate")
    .notEmpty()
    .withMessage("Task date is required")
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const taskDate = new Date(value);
      if (taskDate < today) {
        throw new Error("Past date task is not allowed");
      }
      return true;
    }),

  body("taskTime")
    .notEmpty()
    .withMessage("Task time is required"),
];
