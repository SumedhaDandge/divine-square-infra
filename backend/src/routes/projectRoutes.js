import express from "express";
import {  createProject,  listProjects,  updateProject} from "../controllers/projectController.js";
import authenticateToken from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {  createProjectValidator,  updateProjectValidator,} from "../validators/projectValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// CREATE PROJECT (Admin)
router.post(  "/",  authenticateToken,  authorizeRoles("admin"),  createProjectValidator,  validate,  createProject);

// LIST PROJECTS
router.get("/", authenticateToken, listProjects);
// router.get(
//   "/:id",
//   authenticateToken,
//   getProjectById
// );

// UPDATE PROJECT (Admin)
router.put(  "/:id",  authenticateToken,  authorizeRoles("admin"),  updateProjectValidator,  validate,  updateProject);

export default router;
