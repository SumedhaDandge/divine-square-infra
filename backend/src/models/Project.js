import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true, trim: true , unique: true },

    location: {
      type: String,
      required: true,
      trim: true
    },

    projectType: {
      type: String,
      enum: ["commercial", "residential", "mixed-use"],
      required: true
    },

    totalUnits: {
      type: Number,
      required: true,
      min: 1
    },

    priceRange: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: false
      }
    },

nearbyDevelopments: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NearbyDevelopment"
  }
],

amenities: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Amenity"
  }
],


    projectImages: [
      {
        type: String // store image URL / path
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    projectStage: {
  type: String,
  enum: ["upcoming", "ongoing", "completed"],
  required: true,
  default: "upcoming"
},


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Project", projectSchema);
