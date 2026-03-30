import Audit from "../models/audit.model.js";

// Helper to extract clean request data
const getRequestData = (req) => {
  return {
    params: req.params,
    query: req.query,
    body: req.body,
  };
};

const auditMiddleware = (options = {}) => {
  return async (req, res, next) => {
    const startTime = Date.now();

    // Store original send function
    const originalSend = res.send;

    let responseBody;

    // Capture response body
    res.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    res.on("finish", async () => {
      try {
        const duration = Date.now() - startTime;

        // Skip logging if specified
        if (options.skip && options.skip(req)) return;

        const auditLog = {
          userId: req.user?._id || null,
          action: options.action || req.method,
          entity: options.entity || req.baseUrl || "UNKNOWN",
          entityId: req.params?.id || null,

          details: {
            request: getRequestData(req),
            response: responseBody ? safeParse(responseBody) : null,
            statusCode: res.statusCode,
            duration,
          },

          ipAddress:
            req.headers["x-forwarded-for"] || req.socket.remoteAddress,

          userAgent: req.headers["user-agent"],

          status: res.statusCode >= 400 ? "FAILED" : "SUCCESS",

          errorMessage:
            res.statusCode >= 400 ? responseBody?.message || null : null,
        };

        await Audit.create(auditLog);
      } catch (error) {
        console.error("Audit Logging Failed:", error.message);
      }
    });

    next();
  };
};

// Safely parse JSON response
function safeParse(data) {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}

module.exports = auditMiddleware;
