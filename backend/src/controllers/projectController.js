import { createProjectService,  listProjectsService,  updateProjectService,} from "../services/projectService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createProject = async (req, res) => {
  try {
    const result = await createProjectService(req.body, req.user.id);
    if (result.statusCode !== 201) {
      return errorResponse(res, result.statusCode, result.message);
    }
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 409, "Project with this name already exists");
    }
    return errorResponse(res, 500, "Failed to create project", error.message);
  }
};

// LIST PROJECTS
export const listProjects = async (req, res) => {
  try {
    const data = await listProjectsService();

    return successResponse(res, 200, "Projects fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch projects", error.message);
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const result = await updateProjectService(req.params.id, req.body);

    if (result.statusCode !== 200) {
      return errorResponse(res, result.statusCode, result.message);
    }

    return successResponse(res, 200, result.message, result.data);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 409, "Project with this name already exists");
    }

    return errorResponse(res, 500, "Failed to update project", error.message);
  }
};


// export const getProjectById = async (req, res) => {
//   try {
//     const result = await getProjectByIdService(req.params.id);

//     if (result.statusCode !== 200) {
//       return errorResponse(
//         res,
//         result.statusCode,
//         result.message
//       );
//     }

//     return successResponse(
//       res,
//       200,
//       result.message,
//       result.data
//     );

//   } catch (error) {
//     return errorResponse(
//       res,
//       500,
//       "Failed to fetch project details",
//       error.message
//     );
//   }
// };


