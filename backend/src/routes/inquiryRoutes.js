import express from "express";
import {
  createInquiry,
  listInquiries,
  updateInquiry,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for website
router.post("/", createInquiry);

// Protected routes for CRM
router.get("/", authenticateToken, listInquiries);
router.patch("/:id", authenticateToken, updateInquiry);
router.delete("/:id", authenticateToken, deleteInquiry);

export default router;
