import { Lead } from "../models/Lead.js";
import LeadSource from "../models/LeadSource.js";
import Project from "../models/Project.js";
import { validateMasterExists } from "./common/masterValidation.js";
import { validateUniqueMobile } from "./common/leadValidation.js";


export const createLeadService = async (payload, userId) => {

  // 🔒 Duplicate mobile check
  await validateUniqueMobile(payload.mobile);

  // 🔍 Validate Lead Source
  await validateMasterExists(
    LeadSource,
    payload.leadSource,
    "LeadSource",
    { status: "active" }
  );

  // 🔍 Validate Project (optional)
  if (payload.interestedProject) {
    await validateMasterExists(
      Project,
      payload.interestedProject,
      "Project"
    );
  }

  const lead = await Lead.create({
    ...payload,
    createdBy: userId
  });

  return {
    statusCode: 201,
    message: "Lead created successfully",
    data: lead
  };
};

export const listLeadsService = async () => {
  const leads = await Lead.find()
    .populate("leadSource", "name")
    .populate("interestedProject", "projectName")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return {
    statusCode: 200,
    message: "Leads fetched successfully",
    data: leads,
  };
};

export const getLeadDetailService = async (leadId) => {
  const lead = await Lead.findById(leadId)
    .populate("leadSource", "name")
    .populate("interestedProject", "projectName")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!lead) {
    return {
      statusCode: 404,
      message: "Lead not found",
    };
  }

  return {
    statusCode: 200,
    message: "Lead details fetched successfully",
    data: lead,
  };
};


export const updateLeadService = async (leadId, payload, userId) => {

  // 🔒 Duplicate mobile check (only if mobile is updated)
  if (payload.mobile) {
    await validateUniqueMobile(payload.mobile, leadId);
  }

  // 🔍 Validate Lead Source
  if (payload.leadSource) {
    await validateMasterExists(
      LeadSource,
      payload.leadSource,
      "LeadSource",
      { status: "active" }
    );
  }

  // 🔍 Validate Project
  if (payload.interestedProject) {
    await validateMasterExists(
      Project,
      payload.interestedProject,
      "Project"
    );
  }

  const lead = await Lead.findByIdAndUpdate(
    leadId,
    {
      ...payload,
      updatedBy: userId
    },
    { new: true, runValidators: true }
  );

  if (!lead) {
    throw new Error("Lead not found");
  }

  return {
    statusCode: 200,
    message: "Lead updated successfully",
    data: lead
  };
};
