import mongoose from "mongoose";
import { Lead } from "../../models/Lead.js";

export const validateUniqueMobile = async (mobile, leadId = null) => {
  const query = { mobile };

  // while updating, exclude current lead
  if (leadId) {
    query._id = { $ne: leadId };
  }

  const existingLead = await Lead.findOne(query);

  if (existingLead) {
    throw new Error("Lead with this mobile number already exists");
  }
};

