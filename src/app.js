import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import auditRoutes from "./routes/audit.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(authMiddleware);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);
app.use(errorHandler);



export default app;
