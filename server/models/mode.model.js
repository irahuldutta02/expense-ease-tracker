const mongoose = require("mongoose");
const { Schema } = mongoose;

const modeSchema = new Schema(
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

modeSchema.index({ UserId: 1 });

const Mode = mongoose.model("Mode", modeSchema);

module.exports = Mode;
