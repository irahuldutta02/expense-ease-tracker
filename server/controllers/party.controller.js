const asyncHandler = require("express-async-handler");
const Party = require("../models/party.model.js");

const allListByUserId = asyncHandler(async (req, res) => {
  try {
    const UserId = req.user._id;

    const parties = await Party.find({ UserId: UserId }).populate(
      "UserId",
      "-password"
    );

    return res.status(200).json({
      status: 200,
      data: parties,
    });
  } catch (error) {
    res.status(404);
    throw new Error("Parties not found");
  }
});

const createParty = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    const partyExists = await Party.findOne({
      Name: name,
      UserId: req?.user?._id,
    });

    if (partyExists) {
      res.status(400);
      throw new Error("Party already exists");
    }

    const party = new Party({
      Name: name,
      UserId: req?.user?._id,
    });

    const createdParty = await party.save();

    return res.status(201).json({
      status: 201,
      data: createdParty,
    });
  } catch (error) {
    console.error(error);
    res.status(404);
    throw new Error(error?.message || "Party not created");
  }
});

const updateParty = asyncHandler(async (req, res) => {
  try {
    const UserId = req?.user?._id;

    const { name } = req.body;
    const party = await Party.findById(req.params.id);

    if (!party) {
      res.status(404);
      throw new Error("Party not found");
    }

    if (party?.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to update this party");
    }

    party.Name = name;

    const updatedParty = await party.save();

    return res.status(200).json({
      status: 200,
      data: updatedParty,
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "party not updated");
  }
});

const deleteParty = asyncHandler(async (req, res) => {
  try {
    const UserId = req?.user?._id;

    const party = await Party.findById(req.params.id);

    if (!party) {
      res.status(404);
      throw new Error("Party not found");
    }

    if (party?.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to delete this party");
    }

    await Party.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 200,
      message: "Party removed",
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "Party not deleted");
  }
});

module.exports = { allListByUserId, createParty, updateParty, deleteParty };
