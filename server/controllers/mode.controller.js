const asyncHandler = require("express-async-handler");
const Mode = require("../models/mode.model.js");

const allListByUserId = asyncHandler(async (req, res) => {
  try {
    const UserId = req.user._id;

    const modes = await Mode.find({ UserId: UserId }).populate(
      "UserId",
      "-password"
    );

    return res.status(200).json({
      status: 200,
      data: modes,
    });
  } catch (error) {
    res.status(404);
    throw new Error("Modes not found");
  }
});

const createMode = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    const modeExists = await Mode.findOne({
      Name: name,
      UserId: req?.user?._id,
    });

    if (modeExists) {
      res.status(400);
      throw new Error("Mode already exists");
    }

    const mode = new Mode({
      Name: name,
      UserId: req?.user?._id,
    });

    const createdMode = await mode.save();

    return res.status(201).json({
      status: 201,
      data: createdMode,
    });
  } catch (error) {
    console.error(error);
    res.status(404);
    throw new Error(error?.message || "Mode not created");
  }
});

const updateMode = asyncHandler(async (req, res) => {
  try {
    const UserId = req?.user?._id;

    const { name } = req.body;
    const mode = await Mode.findById(req.params.id);

    if (!mode) {
      res.status(404);
      throw new Error("Mode not found");
    }

    if (mode?.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to update this mode");
    }

    const nameExist = await Mode.findOne({
      Name: name,
      UserId: UserId,
    });

    if (nameExist) {
      res.status(400);
      throw new Error("Mode already exists");
    }

    mode.Name = name;

    const updatedMode = await mode.save();

    return res.status(200).json({
      status: 200,
      data: updatedMode,
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "mode not updated");
  }
});

const deleteMode = asyncHandler(async (req, res) => {
  try {
    const UserId = req?.user?._id;

    const mode = await Mode.findById(req.params.id);

    if (!mode) {
      res.status(404);
      throw new Error("Mode not found");
    }

    if (mode?.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to delete this mode");
    }

    await Mode.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 200,
      message: "Mode removed",
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "Mode not deleted");
  }
});

module.exports = { allListByUserId, createMode, updateMode, deleteMode };
