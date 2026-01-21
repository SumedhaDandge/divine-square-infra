import express from "express";
import { createLeadTask ,listTasksByLead , listAllTasks } from "../controllers/leadTaskController.js";
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

export default router;
