const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String},
      file: {
        url: { type: String, required: false },
        fileName: { type: String, required: false },
        Time: {
          type: Date,
        }
      },
      Image: { type: String}  
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    }
  },
  {
    // why used timestrap --> when does the object get created 
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
