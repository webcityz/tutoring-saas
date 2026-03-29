import express from "express";
import { getProfile, getAllUsers } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);

export default router;
