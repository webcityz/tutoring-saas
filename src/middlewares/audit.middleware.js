import Audit from "../models/audit.model.js";
import logger from "../utils/logger.js";

// Helper to extract clean request data
const getRequestData = (req) => {
  return {
    params: req.params,
    query: req.query,
    body: req.body,
  };
};

// Map HTTP methods to allowed enum values
const methodToAction = {
  GET: "VIEW",
  POST: "CREATE",
  PUT: "UPDATE",
  PATCH: "UPDATE",
  DELETE: "DELETE",
};

const auditMiddleware = (options = {}) => {
  return async (req, res, next) => {
    const startTime = Date.now();

    const originalSend = res.send;
    let responseBody;

    // Capture response body safely
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

          // ✅ FIXED: valid enum mapping
          action:
            options.action ||
            methodToAction[req.method] ||
            "OTHER",

          entity:
            options.entity ||
            req.baseUrl?.replace("/api/", "").toUpperCase() ||
            "UNKNOWN",

          entityId: req.params?.id || null,

          details: {
            request: getRequestData(req),
            response: responseBody ? safeParse(responseBody) : null,
            statusCode: res.statusCode,
            duration,
          },

          ipAddress:
            req.headers["x-forwarded-for"] ||
            req.socket?.remoteAddress ||
            null,

          userAgent: req.headers["user-agent"] || null,

          status: res.statusCode >= 400 ? "FAILED" : "SUCCESS",

          errorMessage:
            res.statusCode >= 400
              ? extractErrorMessage(responseBody)
              : null,
        };

        await Audit.create(auditLog);
       /* console.log("USER:", req.user);
        console.log("AUDIT LOG:", auditLog);*/
        logger.info({
          message: "Audit log created",
          action: auditLog.action,
          entity: auditLog.entity,
          // userId: auditLog.userId,
          userId: auditLog._id,
        });

      } catch (error) {
        logger.error({
          message: "Audit Logging Failed",
          error: error.message,
          userId: req.user?._id || null,
        });
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

// Extract meaningful error message
function extractErrorMessage(responseBody) {
  try {
    const parsed = typeof responseBody === "string"
      ? JSON.parse(responseBody)
      : responseBody;

    return parsed?.message || null;
  } catch {
    return null;
  }
}

export default auditMiddleware;
