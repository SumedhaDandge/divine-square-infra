import {
  createInquiryService,
  listInquiriesService,
  updateInquiryService,
  deleteInquiryService,
} from "../services/inquiryService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createInquiry = async (req, res) => {
  try {
    const result = await createInquiryService(req.body);
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (error) {
    return errorResponse(res, 500, "Failed to submit inquiry", error.message);
  }
};

export const listInquiries = async (req, res) => {
  try {
    const data = await listInquiriesService();
    return successResponse(res, 200, "Inquiries fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch inquiries", error.message);
  }
};

export const updateInquiry = async (req, res) => {
  try {
    const result = await updateInquiryService(req.params.id, req.body);
    if (result.statusCode !== 200) {
      return errorResponse(res, result.statusCode, result.message);
    }
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (error) {
    return errorResponse(res, 500, "Failed to update inquiry", error.message);
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const result = await deleteInquiryService(req.params.id);
    if (result.statusCode !== 200) {
      return errorResponse(res, result.statusCode, result.message);
    }
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete inquiry", error.message);
  }
};
