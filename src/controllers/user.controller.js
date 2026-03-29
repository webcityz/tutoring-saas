import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import getFileName from "../utils/getFileName.js";

const fileName = getFileName(import.meta.url);

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    logger.info({
      message: "Fetching user profile",
      file: fileName,
      userId: req.user.id,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    console.log("Fetching all users for admin:", req.user);

    const users = await User.find();
    logger.info({
  message: "Admin fetched all users",
  file: fileName,
  userId: req.user.id,
});

    res.json(users);
  } catch (err) {
    next(err);
  }
};
