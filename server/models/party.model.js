const mongoose = require("mongoose");
const { Schema } = mongoose;

const partySchema = new Schema(
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

partySchema.index({ UserId: 1 });

const Party = mongoose.model("Party", partySchema);

module.exports = Party;
