const Expense = require("../models/expense.model");
const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GOOGLE_API_KEY } = require("../config/server.config");
const moment = require("moment-timezone");

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const insights = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Please provide both startDate and endDate" });
  }

  const formattedStartDate = moment
    .tz(startDate, "DD-MM-YYYY", "Asia/Kolkata")
    .toISOString();
  const formattedEndDate = moment
    .tz(endDate, "DD-MM-YYYY", "Asia/Kolkata")
    .toISOString();

  try {
    const expenses = await Expense.find({
      UserId: req.user._id,
    }).populate("Party Category Mode");

    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = moment.tz(expense.Date, "Asia/Kolkata").toISOString();
      return moment(expenseDate).isBetween(
        formattedStartDate,
        formattedEndDate,
        null,
        "[]"
      );
    });

    const formattedData = filteredExpenses.map((expense) => ({
      date: moment.tz(expense.Date, "Asia/Kolkata").format("DD-MM-YYYY HH:mm"),
      category: expense.Category ? expense.Category.Name : "Unknown",
      party: expense.Party ? expense.Party.Name : "Unknown",
      mode: expense.Mode ? expense.Mode.Name : "Unknown",
      cashIn: expense.Cash_In,
      cashOut: expense.Cash_Out,
      remark: expense.Remark,
    }));

    // Generate content using Google Generative AI
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      My name is Rahul Dutta. My expenses from ${moment
        .tz(startDate, "Asia/Kolkata")
        .format("DD-MM-YYYY")} to ${moment
      .tz(endDate, "Asia/Kolkata")
      .format("DD-MM-YYYY")} categorically include:
      ${formattedData
        .map(
          (data) =>
            `Date: ${data.date}, Category: ${data.category}, Party: ${data.party}, Mode: ${data.mode}, Cash In: ${data.cashIn}, Cash Out: ${data.cashOut}, Remark: ${data.remark}`
        )
        .join("\n")}
      Provide me with some insights on it. and also give some Tips if possible. Also give category wise, party wise, mode wise total cash in and cash out.
    `;

    const result = await model.generateContent(prompt);

    res.status(200).json({ insights: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error(
      error?.message || "An error occurred while fetching insights"
    );
  }
});

module.exports = {
  insights,
};
