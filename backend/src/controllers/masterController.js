import {
  createNearbyDevelopmentService,
  createAmenityService,
  listNearbyDevelopmentsService,
  listAmenitiesService, listLeadSourcesService  , createLeadSourceService
} from "../services/masterService.js";

import { successResponse, errorResponse } from "../utils/response.js";

// CREATE NEARBY DEVELOPMENT
export const createNearbyDevelopment = async (req, res) => {
  try {
    const data = await createNearbyDevelopmentService(req.body, req.user.id);

    return successResponse(
      res,
      201,
      "Nearby development created successfully",
      data
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// CREATE AMENITY
export const createAmenity = async (req, res) => {
  try {
    const data = await createAmenityService(req.body, req.user.id);

    return successResponse(res, 201, "Amenity created successfully", data);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


export const createLeadSource = async (req, res) => {
  try {
    const data = await createLeadSourceService(req.body, req.user.id);

    return successResponse(
      res,
      201,
      "Lead source created successfully",
      data
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};




















// LIST NEARBY DEVELOPMENTS
export const listNearbyDevelopments = async (req, res) => {
  try {
    const data = await listNearbyDevelopmentsService();

    return successResponse(
      res,
      200,
      "Nearby developments fetched successfully",
      data
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// LIST AMENITIES
export const listAmenities = async (req, res) => {
  try {
    const data = await listAmenitiesService();

    return successResponse(res, 200, "Amenities fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// LIST LEAD SOURCES
export const listLeadSources = async (req, res) => {
  try {
    const data = await listLeadSourcesService();

    return successResponse(
      res,
      200,
      "Lead sources fetched successfully",
      data
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};