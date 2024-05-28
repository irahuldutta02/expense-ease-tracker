const express = require("express");
const {
  allListByUserId,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense.controller.js");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware.js");

router.route("/").get(protect, allListByUserId);
router.route("/create").post(protect, createExpense);
router.route("/:id").put(protect, updateExpense);
router.route("/:id").delete(protect, deleteExpense);

module.exports = router;
