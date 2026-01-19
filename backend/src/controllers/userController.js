import {
  createUserService,
  listUsersService,
  getUserByIdService,
  updateUserService,
  saveFcmTokenService
} from "../services/userService.js";

import {
  successResponse,
  errorResponse
} from "../utils/response.js";

export const createUser = async (req, res) => {
  try {
    const result = await createUserService(req.body, req.user);

    if (!result.success) {
      return errorResponse(res, result.statusCode, result.message);
    }

    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (err) {
    return errorResponse(res, 500, "Failed to create user", err.message);
  }
};

export const listUsers = async (req, res) => {
  try {
    const result = await listUsersService();
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (err) {
    return errorResponse(res, 500, "Failed to fetch users", err.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await getUserByIdService(req.params.id);

    if (!result.success) {
      return errorResponse(res, result.statusCode, result.message);
    }

    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (err) {
    return errorResponse(res, 500, "Failed to fetch user", err.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await updateUserService(req.params.id, req.body);

    if (!result.success) {
      return errorResponse(res, result.statusCode, result.message);
    }

    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (err) {
    return errorResponse(res, 500, "Failed to update user", err.message);
  }
};




export const saveFcmToken = async (req, res) => {

  console.log("Saving FCM token for user:", req.user.id);
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return errorResponse(res, 400, "FCM token is required");
    }

    await saveFcmTokenService(req.user.id, fcmToken);

    return successResponse(res, 200, "FCM token saved successfully");
  } catch (err) {
    return errorResponse(res, 500, "Failed to save FCM token", err.message);
  }
};
