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

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    const categoryExist = await Category.findOne({
      Name: name,
      UserId: req?.user?._id,
    });

    if (categoryExist) {
      res.status(400);
      throw new Error("Category already exists");
    }

    const category = new Category({
      Name: name,
      UserId: req?.user?._id,
    });

    const createdCategory = await category.save();

    return res.status(201).json({
      status: 201,
      data: createdCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(404);
    throw new Error(error?.message || "Category not created");
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const UserId = req?.user?._id;

    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    if (category?.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to update this category");
    }

    const nameExist = await Category.findOne({
      Name: name,
      UserId: UserId,
    });

    if (nameExist) {
      res.status(400);
      throw new Error("Category already exists");
    }

    category.Name = name;

    const updatedCategory = await category.save();

    return res.status(200).json({
      status: 200,
      data: updatedCategory,
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "Category not updated");
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const UserId = req?.user?._id;

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    if (category?.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to delete this category");
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 200,
      message: "Category removed",
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "Category not deleted");
  }
});

module.exports = {
  allListByUserId,
  createCategory,
  updateCategory,
  deleteCategory,
};
