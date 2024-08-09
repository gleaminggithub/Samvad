const mongoose = require("mongoose");

const Token = mongoose.Schema(
  {
    token: { type: String },
    userId:{ type: String },
    isAvaiable: { type: Boolean,default: true}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Token", Token);
