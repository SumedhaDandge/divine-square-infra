import express from "express";
import {
  createLead,
  listLeads,
  getLeadDetails,
  updateLead,
} from "../controllers/leadController.js";

import authenticateToken from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createLeadValidator,
  updateLeadValidator,
} from "../validators/leadValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

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
