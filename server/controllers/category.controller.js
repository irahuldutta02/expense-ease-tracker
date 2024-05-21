import asyncHandler from "express-async-handler";
import Category from "../models/category.model.js";

const allListByUserId = asyncHandler(async (req, res) => {
  try {
    const UserId = req.user._id;

    const catagories = await Category.find({ UserId: UserId }).populate(
      "UserId",
      "-password"
    );

    return res.status(200).json({
      status: 200,
      data: catagories,
    });
  } catch (error) {
    res.status(404);
    throw new Error("Catagories not found");
  }
});

export { allListByUserId };
