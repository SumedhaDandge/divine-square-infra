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

export const bulkCreateLeadsService = async (leadsData, userId) => {
  const results = {
      success: 0,
      failed: 0,
      errors: [] 
  };
  
  // We process one by one to report errors per row
  for (const [index, leadData] of leadsData.entries()) {
      try {
          // Default fields if missing
          if(!leadData.lookingFor) leadData.lookingFor = "Residential";
          if(!leadData.propertyType) leadData.propertyType = "Plot";
          if(!leadData.purpose) leadData.purpose = "Investment";
          
          // 1. Mobile Check
           const existing = await Lead.findOne({ mobile: leadData.mobile });
           if(existing) {
               results.failed++;
               results.errors.push({ row: index + 1, mobile: leadData.mobile, error: "Mobile number already exists" });
               continue;
           }
           
           // 2. Resolve LeadSource (ByName or ID)
           // If leadSource is a Name string, try to find it. If not found, use a default or error.
           // For simplicity in Excel upload, we might expect IDs or exact Names.
           // Let's assume frontend sends IDs or we default to "Excel Import" if we had one.
           // For now, if leadSource is missing, block it.
           if(!leadData.leadSource) {
               // Try to find a default source
               const defaultSource = await LeadSource.findOne({ name: "Website" }); // Fallback
               if(defaultSource) leadData.leadSource = defaultSource._id;
               else throw new Error("Lead Source is required");
           }
           
           await Lead.create({
               ...leadData,
               createdBy: userId
           });
           results.success++;
           
      } catch (error) {
          results.failed++;
          results.errors.push({ row: index + 1, mobile: leadData.mobile, error: error.message });
      }
  }
  
  return {
      statusCode: 200,
      message: "Bulk upload processed",
      data: results
  };
};
