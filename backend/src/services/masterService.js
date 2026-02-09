import NearbyDevelopment from "../models/NearbyDevelopment.js";
import Amenity from "../models/Amenity.js";
import LeadSource from "../models/LeadSource.js";

export const createNearbyDevelopmentService = async (payload, userId) => {
  const data = await NearbyDevelopment.create({
    ...payload,
    createdBy: userId
  });

  return {
    statusCode: 201,
    message: "Nearby development added",
    data
  };
};

export const createAmenityService = async (payload, userId) => {
  const data = await Amenity.create({
    ...payload,
    createdBy: userId
  });

  return {
    statusCode: 201,
    message: "Amenity added",
    data
  };
};


export const createLeadSourceService = async (payload, userId) => {

  const source = await LeadSource.create({
    name: payload.name,
    createdBy: userId
  });

  return source;
};
























// LIST SERVICES

export const listNearbyDevelopmentsService = async () => {
  return await NearbyDevelopment.find({ status: "active" }).sort({
    name: 1
  });
};

export const listAmenitiesService = async () => {
  return await Amenity.find({ status: "active" }).sort({
    name: 1
  });
};



export const listLeadSourcesService = async () => {
  return await LeadSource.find({ status: "active" }).sort({
    name: 1
  });
};

export const updateNearbyDevelopmentService = async (id, payload) => {
  const data = await NearbyDevelopment.findByIdAndUpdate(id, payload, { new: true });
  return {
    statusCode: 200,
    message: "Nearby development updated",
    data
  };
};

export const updateAmenityService = async (id, payload) => {
  const data = await Amenity.findByIdAndUpdate(id, payload, { new: true });
  return {
    statusCode: 200,
    message: "Amenity updated",
    data
  };
};

export const updateLeadSourceService = async (id, payload) => {
  const data = await LeadSource.findByIdAndUpdate(id, payload, { new: true });
  return {
    statusCode: 200,
    message: "Lead source updated",
    data
  };
};
