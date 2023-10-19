import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });

    await newUser.save();

    res.status(201).json("User Create Successfully!");
  } catch (error) {
    next(error);
  }
};
