import express from "express";
import { allListByUserId } from "../controllers/expense.controller.js";
const router = express.Router();

import { protect } from "../middleware/auth.middleware.js";

router.route("/").get(protect, allListByUserId);

export default router;
