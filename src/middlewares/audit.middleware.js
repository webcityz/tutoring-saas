import Audit from "../models/audit.model.js";
import logger from "../utils/logger.js";

// Helper to extract clean request data
const getRequestData = (req) => ({
  params: req.params,
  query: req.query,
  body: req.body,
});

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

    // Capture response body
    res.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    res.on("finish", async () => {
      try {
        const duration = Date.now() - startTime;

        // Skip logging if needed
        if (options.skip && options.skip(req)) return;

        const auditLog = {
          // ✅ FIXED: supports both _id and id
          userId: req.user?._id || req.user?.id || null,

          // ✅ NEW: snapshot of user (very useful)
          userSnapshot: req.user
            ? {
                email: req.user.email,
                role: req.user.role,
              }
            : null,

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
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket?.remoteAddress ||
            null,

          userAgent: req.headers["user-agent"] || null,

          status: res.statusCode >= 400 ? "FAILED" : "SUCCESS",

          errorMessage:
            res.statusCode >= 400
              ? extractErrorMessage(responseBody)
              : null,
        };

        const createdLog = await Audit.create(auditLog);

        logger.info({
          message: "Audit log created",
          action: createdLog.action,
          entity: createdLog.entity,
          userId: createdLog.userId,
          auditId: createdLog._id,
        });

      } catch (error) {
        logger.error({
          message: "Audit Logging Failed",
          error: error.message,
          userId: req.user?._id || req.user?.id || null,
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
    const parsed =
      typeof responseBody === "string"
        ? JSON.parse(responseBody)
        : responseBody;

    return parsed?.message || null;
  } catch {
    return null;
  }
}

export default auditMiddleware;
