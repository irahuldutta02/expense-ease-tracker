const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model.js");

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

module.exports = { allListByUserId };
