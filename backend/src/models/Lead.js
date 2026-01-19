import mongoose from "mongoose";
import { LEAD_STATUS } from "../constants/leadStatus.js";

const leadSchema = new mongoose.Schema(
  {
    // 👤 Customer Info
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // 📍 Lead Source (Master)
    leadSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadSource",
      required: true,
    },

    // 🏗️ Interested Project (Optional)
    interestedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // 📍 Location preference
    lookingLocation: {
      type: String,
      trim: true,
    },

    // 🏠 WHAT he is looking for
    lookingFor: {
      type: String,
      enum: ["Residential", "Commercial"],
      required: true,
    },

    // 🧱 Property Type
    propertyType: {
      type: String,
      enum: ["Plot", "Flat", "Shop", "Office"],
      required: true,
    },

    // 🎯 Purpose
    purpose: {
      type: String,
      enum: ["Self Use", "Investment", "Rental"],
      required: true,
    },

    // 💰 Budget
    budget: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },

    // 🌍 Belongs from
    belongsFrom: {
      type: String,
      trim: true,
    },

    // 📝 Remarks
    remarks: {
      type: String,
      trim: true,
    },

    // 🚦 Lead Status
    leadStatus: {
      type: String,
      enum: LEAD_STATUS,
      default: "new",
    },

    // 🔮 Future Interest (Flat / Future product)
    isFutureInterest: {
      type: Boolean,
      default: false,
    },

    // 👤 Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // ✅ handles createdAt & updatedAt
  }
);

// 📱 Fast search & duplicate checks
leadSchema.index({ mobile: 1 });

export const Lead = mongoose.model("Lead", leadSchema);
