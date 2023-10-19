import User from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });

    await newUser.save();

    res.status(201).json("User Create Successfully!");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
