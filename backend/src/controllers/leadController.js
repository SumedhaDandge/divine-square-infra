import {
  createLeadService,
  listLeadsService,
  getLeadDetailService,
  updateLeadService,
  bulkCreateLeadsService,
  importLeadsService,
} from "../services/leadService.js";

export const importLeads = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await importLeadsService(req.file.buffer, req.user.id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to import leads",
            error: error.message
        });
    }
};

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

export const bulkCreateLeads = async (req, res) => {
    try {
        const result = await bulkCreateLeadsService(req.body, req.user.id);
        return res.status(result.statusCode).json(result);
    } catch(error) {
        return res.status(500).json({
            message: "Failed to bulk create leads",
            error: error.message
        });
    }
}

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
