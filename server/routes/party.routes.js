const express = require("express");
const {
  allListByUserId,
  createParty,
  updateParty,
  deleteParty,
} = require("../controllers/party.controller.js");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware.js");

router.route("/").get(protect, allListByUserId);
router.route("/").post(protect, createParty);
router.route("/:id").put(protect, updateParty);
router.route("/:id").delete(protect, deleteParty);

module.exports = router;
