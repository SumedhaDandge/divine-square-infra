
import { createQuotationService, listQuotationsService } from "../services/quotationService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createQuotation = async (req, res) => {
  try {
    const result = await createQuotationService(req.body, req.user.id);
    return successResponse(res, result.statusCode, result.message, result.data);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const listQuotations = async (req, res) => {
  try {
    const { leadId } = req.params;
    const result = await listQuotationsService(leadId);
    return successResponse(res, result.statusCode, "Quotations fetched", result.data);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
