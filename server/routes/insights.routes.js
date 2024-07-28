const express = require("express");
const { insights } = require("../controllers/insights.controller");
const { protect } = require("../middleware/auth.middleware");
const insightRouters = express.Router();

insightRouters.get("/insights", protect, insights);

module.exports = insightRouters;
