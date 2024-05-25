const express = require("express");
const { allListByUserId } = require("../controllers/mode.controller.js");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware.js");

router.route("/").get(protect, allListByUserId);

module.exports = router;
