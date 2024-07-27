const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/server.config.js");
const User = require("../models/user.model.js");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const header = req.header("Authorization");
  if (header && header.startsWith("Bearer")) {
    token = header.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
