import express from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createUser,
  listUsers,
  getUserById,
  updateUser ,saveFcmToken
} from "../controllers/userController.js";

const router = express.Router();

// CREATE USER (Admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createUser
);

// LIST USERS (Admin & Manager)
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  listUsers
);

// GET USER BY ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  getUserById
);

// UPDATE USER (Admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateUser
);

router.post(
  "/save-fcm-token",
  authenticateToken,
  saveFcmToken
);

export default router;
