const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");
const generateToken = require("../utils/generateToken.js");
const sendEmail = require("../utils/sendEmail.js");
const { CLIENT_URL } = require("../config/server.config.js");
const crypto = require("crypto");

const getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.status(200).json({
        status: 200,
        data: user,
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      return res.status(200).json({
        status: 200,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          token: token,
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
      avatar: `https://avatar.iran.liara.run/username?username=${name}`,
    });

    if (user) {
      const token = generateToken(user._id);

      return res.status(201).json({
        status: 201,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          token: token,
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
      user.avatar = req.body.avatar || user.avatar;

      const updatedUser = await user.save();

      token = generateToken(updatedUser._id);

      res.status(200).json({
        status: 200,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          token: token,
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

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const resetToken = user.createResetToken();
    user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    const htmlMessage = `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <tr>
            <td style="text-align: center; padding: 10px 0;">
                <h1 style="color: #333333;">ExpenseEase</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <h2 style="color: #333333;">Reset Your Password</h2>
                <p style="color: #555555; line-height: 1.5;">
                    Hello,
                </p>
                <p style="color: #555555; line-height: 1.5;">
                    We received a request to reset your password for your ExpenseEase account. Click the button below to reset your password.
                </p>
                <p style="text-align: center; padding: 20px 0;">
                    <a href=${resetUrl} style="background-color: #28a745; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
                </p>
                <p style="color: #555555; line-height: 1.5;">
                    If the button above does not work, copy and paste the following link into your browser:
                </p>
                <p style="color: #555555; line-height: 1.5;">
                    <a href=${resetUrl} style="color: #28a745;">${resetUrl}</a>
                </p>
                <p style="color: #555555; line-height: 1.5;">
                    If you did not request a password reset, please ignore this email or contact support if you have questions.
                </p>
                <p style="color: #555555; line-height: 1.5;">
                    Thanks,<br>
                    The ExpenseEase Team
                </p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px 0; color: #999999; font-size: 12px;">
                &copy;
    2024 ExpenseEase.All rights reserved.</ td></ tr></ table></ body>`;

    try {
      await sendEmail({
        email: user.email,
        subject: "ExpenseEase: Reset Your Password (valid for 10 minutes)",
        htmlMessage,
      });

      res.status(200).json({
        status: 200,
        message: "Token sent to email!",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save();
      res.status(500).json({
        status: 500,
        message: "There was an error sending the email. Try again later!",
      });
    }
  } catch (error) {
    res.status(404);
    throw new Error("User not found");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "Token is invalid or has expired",
      });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      status: 200,
      message: "Password reset successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Invalid token");
  }
});

module.exports = {
  getMe,
  loginUser,
  registerUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
