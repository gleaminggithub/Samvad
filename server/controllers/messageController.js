const Messages = require("../models/messageModel");
const Chat = require("../models/chatModel");
const cloudinary = require("../cloudinary/cloudinary");
module.exports.getMessages = async (req, res, next) => {
  try {
    // console.log(req.body);
    const  {chatId,user}  = req.body.currentChat;
    // console.log(chatId);
    const messages = await Messages.find({
      chatId
    }).sort({ updatedAt: 1 });
    // print("line12/messageControllers");
    // console.log(messages);
    console.log("getMessages");
    
    const projectedMessages = messages.map((msg) => {
      // console.log(msg);
      // console.log("msg.sender",msg.sender.toString());
      // console.log("user",user._id);
      return {
        fromSelf: msg.sender.toString() !== user._id,
        text: msg.message.text,
        url:msg.message.file !== undefined ? msg.message.file.url : null ,
        filename: msg.message.file !== undefined ? msg.message.file.fileName : null,
        Time:msg.message.file !== undefined ? msg.message.file.Time:null,
        Image:msg.message.Image !== undefined ? msg.message.Image : null
        // image:msg.message.img,
      };
    });
    console.log("ProjectedMessages");
    // console.log(projectedMessages);
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { currentChat, message, userId } = req.body;
    const { chatId } = currentChat;
    const msg = message;

    // Handle file upload if present
    if (msg.file && msg.file.base64) {
      const uploadResponse = await cloudinary.uploader.upload(msg.file.base64, {
        upload_preset: 'gocj9ra1',
      });

      const newMessage = {
        message: {
          text: msg.text,
          file: {
            url: uploadResponse.url,
            fileName: msg.file.name,
            Time: new Date(),
          },
          Image: message.Image,
        },
        sender: userId,
        chatId,
      };

      const data = await Messages.create(newMessage);

      if (data && data._id) {
        await Chat.findByIdAndUpdate(
          chatId,
          {
            latestMessage: data._id,
            Time: new Date(),
          },
          { new: true }
        );
      }

      return res.json(data);

    } else {
      // Handle text-only message
      const newMessage = {
        message: {
          text: msg.text,
          file: { Time: new Date() },
          Image: message.Image,
        },
        sender: userId,
        chatId,
      };

      const data = await Messages.create(newMessage);

      if (data && data._id) {
        await Chat.findByIdAndUpdate(
          chatId,
          {
            latestMessage: data._id,
            Time: new Date(),
          },
          { new: true }
        );
      }

      return res.json(data);
    }
  } catch (ex) {
    console.error("Error in addMessage:", ex);
    next(ex);
  }
};
