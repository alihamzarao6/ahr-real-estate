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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // checking error in controller
    if (!email || !password) {
      return next(errorHandler(400, "Please provide email and password"));
    }

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User Not Found!"));
    }

    const validPassword = await validUser.comparePassword(password);

    if (!validPassword) {
      return next(errorHandler(401, "Invalid Credentials!"));
    }

    // generate token using mongoose instance methods in Schema file
    const token = validUser.generateJWT();

    // prevent password from being sent with response
    const { password: pw, ...restAll } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restAll);
  } catch (error) {
    next(error);
  }
};
