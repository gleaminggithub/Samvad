const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    chatName: { type: String },
    isGroupChat: { type: Boolean },  // Corrected here
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Update to use ObjectId for better schema design
    latestMessage:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Messages',
    },
    Time:{type:Date},
    groupAdmin:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    chatImage:{
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
