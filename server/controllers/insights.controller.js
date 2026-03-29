const Expense = require("../models/expense.model");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const {
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
} = require("../config/server.config");
const moment = require("moment-timezone");

const insights = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Please provide both startDate and endDate",
    });
  }

  const formattedStartDate = moment
    .tz(startDate, "DD-MM-YYYY", "Asia/Kolkata")
    .toISOString();

  const formattedEndDate = moment
    .tz(endDate, "DD-MM-YYYY", "Asia/Kolkata")
    .toISOString();

  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        message: "OpenRouter API Key is missing. Please check your .env file.",
      });
    }

    const expenses = await Expense.find({
      UserId: req.user._id,
    }).populate("Party Category Mode");

    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = moment.tz(expense.Date, "Asia/Kolkata").toISOString();
      return moment(expenseDate).isBetween(
        formattedStartDate,
        formattedEndDate,
        null,
        "[]",
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

    const prompt = `
You are a sharp personal finance analyst. Write a convincing, confident expense analysis for ${req.user.name}.

Date range:
- From: ${moment.tz(startDate, "DD-MM-YYYY", "Asia/Kolkata").format("DD-MM-YYYY")}
- To: ${moment.tz(endDate, "DD-MM-YYYY", "Asia/Kolkata").format("DD-MM-YYYY")}

Transactions:
${formattedData
  .map(
    (data) =>
      `Date: ${data.date}, Category: ${data.category}, Party: ${data.party}, Mode: ${data.mode}, Cash In: ₹${data.cashIn}, Cash Out: ₹${data.cashOut}, Remark: ${data.remark || "None"}`,
  )
  .join("\n")}

Instructions:
- Do not ask the user any questions.
- Do not say you need more information.
- Do not use filler openings like "Okay", "Sure", or "Let's break this down".
- Start directly with the analysis.
- Be persuasive, practical, and specific.
- If spending looks reasonable, say so clearly. If it looks excessive, say so clearly.
- Highlight the biggest spending patterns and the most important takeaways.
- Give concrete recommendations with clear reasoning.
- Include category-wise totals, party-wise totals, and mode-wise totals.
- Use Markdown.

Response structure:
## Overall Summary
Short, direct summary of total spending, average spending, and the main financial pattern.

## Key Insights
3 to 6 bullet points with actionable observations.

## Category-Wise Breakdown
Markdown table with total amount and share of total.

## Party-Wise Breakdown
Markdown table with total amount and share of total.

## Mode-Wise Breakdown
Markdown table with total amount and share of total.

## Recommendations
3 to 5 direct recommendations. Each recommendation should explain why it matters.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            "https://github.com/irahuldutta02/expense-ease-tracker", // Optional, for OpenRouter rankings
          "X-Title": "ExpenseEase Tracker", // Optional, for OpenRouter rankings
        },
      },
    );

    const text =
      response.data.choices[0]?.message?.content || "No insights found";
    const usedModel =
      response.data.model || OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

    res.status(200).json({
      insights: text,
      model: usedModel,
    });
  } catch (error) {
    res.status(500);
    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Error generating insights",
    );
  }
});

module.exports = {
  insights,
};
