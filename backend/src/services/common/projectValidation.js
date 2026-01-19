import Amenity from "../../models/Amenity.js";
import NearbyDevelopment from "../../models/NearbyDevelopment.js";

export const validateMastersExist = async ({
  amenities = [],
  nearbyDevelopments = []
}) => {
  // ✅ Validate Amenities
  if (amenities.length) {
    const amenityCount = await Amenity.countDocuments({
      _id: { $in: amenities }
    });

    if (amenityCount !== amenities.length) {
      return {
        statusCode: 400,
        message: "One or more amenities are invalid"
      };
    }
  }

  // ✅ Validate Nearby Developments
  if (nearbyDevelopments.length) {
    const nearbyCount = await NearbyDevelopment.countDocuments({
      _id: { $in: nearbyDevelopments }
    });

    if (nearbyCount !== nearbyDevelopments.length) {
      return {
        statusCode: 400,
        message: "One or more nearby developments are invalid"
      };
    }
  }

  return null;
};
