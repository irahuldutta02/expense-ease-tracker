const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");
const generateToken = require("../utils/generateToken.js");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      return res.status(200).json({
        status: 200,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);

      return res.status(201).json({
        status: 201,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error?.message || "Something went wrong");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.body._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      generateToken(res, updatedUser._id);

      res.status(200).json({
        status: 200,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404);
    throw new Error("User not found");
  }
});

const logOutUser = asyncHandler((req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("connect.sid", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { logOutUser, loginUser, registerUser, updateUserProfile };
