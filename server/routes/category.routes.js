const express = require("express");
const {
  allListByUserId,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller.js");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware.js");

router.route("/").get(protect, allListByUserId);
router.route("/").post(protect, createCategory);
router.route("/:id").put(protect, updateCategory);
router.route("/:id").delete(protect, deleteCategory);

module.exports = router;
