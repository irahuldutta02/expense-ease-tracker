import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/server.config.js";
import User from "../models/user.model.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
