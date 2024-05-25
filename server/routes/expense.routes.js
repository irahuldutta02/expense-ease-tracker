const express = require("express");
const { allListByUserId } = require("../controllers/expense.controller.js");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware.js");

router.route("/").get(protect, allListByUserId);

module.exports = router;
