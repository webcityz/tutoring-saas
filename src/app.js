import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);



export default app;
