import express from "express";
import { createLeadTask ,listTasksByLead , listAllTasks, completeTask, cancelTask, updateLeadTask } from "../controllers/leadTaskController.js";
import authenticateToken from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createLeadTaskValidator } from "../validators/leadTaskValidator.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  createLeadTaskValidator,
  validate,
  createLeadTask
);


router.get("/:leadId", authenticateToken, listTasksByLead);

router.get("/", authenticateToken, listAllTasks);

router.patch("/complete/:taskId",authenticateToken,completeTask)
router.patch("/cancel/:taskId", authenticateToken, cancelTask);
router.put("/:taskId", authenticateToken, updateLeadTask);



export default router;
