const express = require("express");
const {
  allListByUserId,
  createMode,
  updateMode,
  deleteMode,
} = require("../controllers/mode.controller.js");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware.js");

router.route("/").get(protect, allListByUserId);
router.route("/").post(protect, createMode);
router.route("/:id").put(protect, updateMode);
router.route("/:id").delete(protect, deleteMode);

module.exports = router;
