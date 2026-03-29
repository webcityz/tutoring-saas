import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import getFileName from "../utils/getFileName.js";

const fileName = getFileName(import.meta.url);


export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    logger.info({
      message: "Registering new user",
      body: req.body,
      file: fileName,
    });

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.info({
        message: "User already exists",
        email: req.body.email,
        file: fileName,
      });
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    logger.info({
      message: "User login",
      file: fileName,
      userId: user._id,
  });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

