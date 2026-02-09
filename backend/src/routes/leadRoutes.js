import express from "express";
import {
  createLead,
  listLeads,
  getLeadDetails,
  updateLead,
  bulkCreateLeads,
  importLeads,
} from "../controllers/leadController.js";

import authenticateToken from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createLeadValidator,
  updateLeadValidator,
} from "../validators/leadValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/import",
  authenticateToken,
  authorizeRoles("admin", "sales"),
  upload.single("file"), // Expecting form-data field 'file'
  importLeads
);

router.post(
  "/bulk",
  authenticateToken,
  authorizeRoles("admin", "sales"),
  bulkCreateLeads
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "sales"),
  createLeadValidator,
  validate,
  createLead
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "sales"),
  listLeads
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "sales"),
  getLeadDetails
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "sales"),
  updateLeadValidator,
  validate,
  updateLead
);

export default router;
