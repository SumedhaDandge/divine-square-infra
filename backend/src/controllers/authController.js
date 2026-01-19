import { loginService } from "../services/authService.js";
import {
  successResponse,
  errorResponse
} from "../utils/response.js";

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    if (!result.success) {
      return errorResponse(
        res,
        result.statusCode,
        result.message
      );
    }

    return successResponse(
      res,
      result.statusCode,
      result.message,
      result.data
    );
  } catch (err) {
    return errorResponse(
      res,
      500,
      "Login failed",
      err.message
    );
  }
};
