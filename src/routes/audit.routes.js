import express from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import auditMiddleware from "../middlewares/audit.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  auditMiddleware(),
  roleMiddleware("admin"),
  getAuditLogs
);

export default router;
