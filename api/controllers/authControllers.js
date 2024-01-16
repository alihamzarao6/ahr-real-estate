import User from "../models/userModel.js";
import { convertToUsername } from "../utils/convertUsername.js";
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
      return next(errorHandler(401, "Invalid Credentials!"));
    }

    const validPassword = await validUser.comparePassword(password);

    if (!validPassword) {
      return next(errorHandler(401, "Invalid Credentials!"));
    }

    // generate token using mongoose instance methods in Schema file
    const token = validUser.generateJWT(validUser._id, validUser.username);

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

// handle signin with google
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // if user exist then create a token and save it into cookie.
      const token = user.generateJWT(user._id, user.username);
      const { password: pw, ...restAll } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restAll);
    } else {
      // create a new user and save to database
      const generateRandomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // Convert name to username format
      const convertedUsername = convertToUsername(req.body.name);

      const newUser = new User({
        username: convertedUsername,
        email: req.body.email,
        password: generateRandomPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = newUser.generateJWT(newUser._id, newUser.username);
      const { password: pw, ...restAll } = newUser._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restAll);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");

    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
}
