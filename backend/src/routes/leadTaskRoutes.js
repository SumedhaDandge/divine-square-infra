import express from "express";
import { createLeadTask ,listTasksByLead , listAllTasks } from "../controllers/leadTaskController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createLeadTask);

router.get("/:leadId", authenticateToken, listTasksByLead);

router.get("/", authenticateToken, listAllTasks);

export default router;
