const mongoose = require("mongoose");

const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    Date: {
      type: String,
      required: true,
    },
    Remark: {
      type: String,
      required: false,
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Party: {
      type: Schema.Types.ObjectId,
      ref: "Party",
      required: false,
    },
    Category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    Mode: {
      type: Schema.Types.ObjectId,
      ref: "Mode",
      required: false,
    },
    Cash_In: {
      type: Number,
      required: false,
    },
    Cash_Out: {
      type: Number,
      required: false,
    },
    attachments: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ UserId: 1 });

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
