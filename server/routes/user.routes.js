const express = require("express");
const {
  getMe,
  registerUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  loginUser,
} = require("../controllers/user.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/update").put(updateUserProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").patch(resetPassword);
router.route("/me").get(protect, getMe);

module.exports = router;
