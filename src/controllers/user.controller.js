import User from "../models/user.model.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    console.log("Fetching all users for admin:", req.user);
    const users = await User.find();

    res.json(users);
  } catch (err) {
    next(err);
  }
};
