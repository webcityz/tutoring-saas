import Audit from "../models/audit.model.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await Audit.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};
