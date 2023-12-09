import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const authenticatedUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = { id: user._id, username: user.username };

    next();
  } catch (error) {
    next(error);
  }
};
