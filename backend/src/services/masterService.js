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
  const data = await NearbyDevelopment.find({ status: "active" }).sort({
    name: 1
  });

  return {
    statusCode: 200,
    data
  };
};

export const listAmenitiesService = async () => {
  const data = await Amenity.find({ status: "active" }).sort({
    name: 1
  });

  return {
    statusCode: 200,
    data
  };
};


export const listLeadSourcesService = async () => {
  const data = await LeadSource.find({ status: "active" }).sort({
    name: 1
  });
  return {
    statusCode: 200,
    data
  };
}