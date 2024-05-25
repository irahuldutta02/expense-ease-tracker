const express = require("express");
const {
  loginUser,
  logOutUser,
  registerUser,
  updateUserProfile,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/update").put(updateUserProfile);
router.route("/logout").get(logOutUser);

module.exports = router;
