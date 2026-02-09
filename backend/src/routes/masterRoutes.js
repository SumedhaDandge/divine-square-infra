import express from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createNearbyDevelopment,
  createAmenity,
  listNearbyDevelopments,
  listAmenities,listLeadSources,
  createLeadSource,
  updateNearbyDevelopment,
  updateAmenity,
  updateLeadSource,
} from "../controllers/masterController.js";


const router = express.Router();

// CREATE (Admin)
router.post(
  "/nearby-development",
  authenticateToken,
  authorizeRoles("admin"),
  createNearbyDevelopment
);
router.post(
  "/amenity",
  authenticateToken,
  authorizeRoles("admin"),
  createAmenity
);

router.post(
  "/lead-source",
  authenticateToken,
  authorizeRoles("admin"),
  createLeadSource
);


// UPDATE (Admin)
router.put(
  "/nearby-development/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateNearbyDevelopment
);

router.put(
  "/amenity/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateAmenity
);

router.put(
  "/lead-source/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateLeadSource
);

// LIST (Dropdown usage)
router.get("/nearby-development", authenticateToken, listNearbyDevelopments);
router.get("/amenity", authenticateToken, listAmenities);
router.get("/lead-source", authenticateToken, listLeadSources);

export default router;
