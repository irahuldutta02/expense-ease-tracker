import asyncHandler from "express-async-handler";
import Party from "../models/party.model.js";

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

export { allListByUserId };
