const asyncHandler = require("express-async-handler");
const Expense = require("../models/expense.model.js");

const allListByUserId = asyncHandler(async (req, res) => {
  try {
    const UserId = req.user._id;

    const expenses = await Expense.find({ UserId: UserId })
      .populate("Mode")
      .populate("Category")
      .populate("Party")
      .populate("UserId", "-password");

    //  the expense.Date is like "2024-05-26T23:09" this formate so we need to sort the expenses by Date in descending order

    expenses.sort((a, b) => {
      return new Date(b.Date) - new Date(a.Date);
    });

    return res.status(200).json({
      status: 200,
      data: expenses,
    });
  } catch (error) {
    res.status(404);
    throw new Error("Expenses not found");
  }
});

module.exports = { allListByUserId };
