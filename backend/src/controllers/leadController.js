import {
  createLeadService,
  listLeadsService,
  getLeadDetailService,
  updateLeadService,
} from "../services/leadService.js";

export const createLead = async (req, res) => {
  try {
    const result = await createLeadService(req.body, req.user.id);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

export const listLeads = async (req, res) => {
  try {
    const result = await listLeadsService();
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

export const getLeadDetails = async (req, res) => {
  try {
    const result = await getLeadDetailService(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch lead details",
      error: error.message,
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const result = await updateLeadService(
      req.params.id,
      req.body,
      req.user.id
    );
    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update lead",
      error: error.message,
    });
  }
};
