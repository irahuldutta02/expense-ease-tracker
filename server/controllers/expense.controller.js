const asyncHandler = require("express-async-handler");
const Expense = require("../models/expense.model.js");

const allListByUserId = asyncHandler(async (req, res) => {
  try {
    const UserId = req.user._id;

    const expenses = await Expense.find({ UserId })
      .populate("Mode")
      .populate("Category")
      .populate("Party")
      .populate("UserId", "-password")
      .sort({ createdAt: "asc" });

    // Sort expenses by date in ascending order
    const sortedExpenses = expenses.sort(
      (a, b) => new Date(a.Date) - new Date(b.Date)
    );

    // Add the balance key to each expense record
    const result = sortedExpenses.map((expense) => expense.toObject()); // Convert all expenses to plain objects
    for (let i = 0; i < result.length; i++) {
      if (i === 0) {
        result[i].balance = result[i].Cash_In
          ? result[i].Cash_In
          : -result[i].Cash_Out;
      } else {
        result[i].balance =
          result[i - 1].balance +
          (result[i].Cash_In ? result[i].Cash_In : -result[i].Cash_Out);
      }
    }

    // reverse the array
    result.reverse();

    return res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "Expenses not found");
  }
});

const createExpense = asyncHandler(async (req, res) => {
  try {
    const {
      Amount,
      Date,
      Mode,
      Category,
      Party,
      Description,
      Cash_In,
      Cash_Out,
      Remark,
    } = req.body;

    const UserId = req.user._id;

    const expense = new Expense({
      Amount,
      Date,
      Mode,
      Category,
      Party,
      Description,
      UserId,
      Cash_In,
      Cash_Out,
      Remark,
    });

    const createdExpense = await expense.save();

    res.status(201).json({
      status: 201,
      data: createdExpense,
    });
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "Expense not created");
  }
});

const updateExpense = asyncHandler(async (req, res) => {
  try {
    const {
      Amount,
      Date,
      Mode,
      Category,
      Party,
      Description,
      Cash_In,
      Cash_Out,
      Remark,
    } = req.body;

    const UserId = req.user._id;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error("Expense not found");
    }

    if (expense.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to access this resource");
    }

    if (expense) {
      expense.Amount = Amount;
      expense.Date = Date;
      expense.Mode = Mode;
      expense.Category = Category;
      expense.Party = Party;
      expense.Description = Description;
      expense.Cash_In = Cash_In;
      expense.Cash_Out = Cash_Out;
      expense.Remark = Remark;

      const updatedExpense = await expense.save();

      res.status(200).json({
        status: 200,
        data: updatedExpense,
      });
    } else {
      res.status(404);
      throw new Error("Expense not found");
    }
  } catch (error) {
    res.status(404);
    throw new Error(error?.message || "Expense not found");
  }
});

const deleteExpense = asyncHandler(async (req, res) => {
  try {
    const UserId = req.user._id;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error("Expense not found");
    }

    if (expense?.UserId.toString() !== UserId.toString()) {
      res.status(401);
      throw new Error("Not authorized to access this resource");
    }

    await Expense.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: 200,
      message: "Expense removed",
    });
  } catch (error) {
    res.status(404);
    console.error(error);
    throw new Error(error?.message || "Expense not found");
  }
});

module.exports = {
  allListByUserId,
  createExpense,
  updateExpense,
  deleteExpense,
};
