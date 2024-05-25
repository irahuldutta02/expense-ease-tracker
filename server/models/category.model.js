const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ UserId: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
