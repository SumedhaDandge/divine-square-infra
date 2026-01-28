
import express from "express";
import { createQuotation, listQuotations } from "../controllers/quotationController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createQuotation);
router.get("/:leadId", authenticateToken, listQuotations); // Get quotes for a lead

export default router;
