const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const chatRoutes = require("./routes/chatRoute");
const app = express();
const socket = require("socket.io");
const axios = require('axios');
const bodyParser = require('body-parser');
const multer=require('multer');
const cloudinary = require("./cloudinary/cloudinary");
const tokenRoute = require("./routes/tokenRoute");
require("dotenv").config();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/token", tokenRoute);
// app.use("",(req,res)=>{
//   return res.send("Working");
// })

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});



  global.onlineUsers = new Map();
  io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on('add-user',(user)=>{
      console.log(user);
      socket.join(user);
      global.onlineUsers.set(user, socket.id);
    io.emit('user-status', { user, online: true });
    });
    socket.on('check-status', (userId) => {
      const isOnline = global.onlineUsers.has(userId);
      socket.emit('user-status', { userId, online: isOnline });
    });
  
    socket.on('join-room',(room)=>{
      socket.join(room);
      console.log(`User joined room: ${room}`);
    })
    socket.on('send-msg',(data)=>{
      console.log(data);
      console.log("data-chatId",data.currentChat.chatId);
        // socket.to(data.currentChat.chatId).emit('msg-recieve',data.msg);
        console.log(data.currentChat.chatId);
        console.log(typeof(data.currentChat.chatId));
        socket.to(data.currentChat.chatId).emit('msg-recieve',data.msg);
        // socket.emit('msg-recieve',data.msg);
    })
    socket.on('videoCallRequest', (data) => {
      const { recipient, token } = data;
      // Forward the request to the receiver
      console.log(recipient);
      const socketId=onlineUsers.get(recipient);
      console.log(onlineUsers);
      console.log(socketId);
      io.to(socketId).emit('incomingVideoCall', { sender:socket.id, token });
  });

  // When the receiver accepts the call
  socket.on('acceptVideoCall', (data) => {
      const { sender, token } = data;
      // Inform the sender that the call is accepted
      io.to(sender).emit('videoCallAccepted', { token });
  });
  socket.on('videoCallRejected',(data)=>{
    const {sender}=data;
    io.to(sender).emit('VideocallDenied',{Message:"Call Denied"});
  });
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
});
  });
// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   console.log("Socket line 43" ,socket.id);
//   socket.on('add-user', (userId) => {
//     console.log(`User added: ${userId}`);
//     onlineUsers.set(userId, socket.id);  // Add user ID and socket ID to onlineUsers Map
//     console.log(onlineUsers.keys());
//     // io.emit("update-user-status", Array.from(onlineUsers.keys())); 
//     console.log("Online users:", onlineUsers);
//   });
//   console.log("Online users:", onlineUsers);
//   console.log(onlineUsers);
//   socket.on('send-msg', (data) => {
//     console.log("scoket-data",data);
//     console.log(onlineUsers);
//     const sendUserSocket = onlineUsers.get(data.currentChat.user._id);
//     console.log(data.currentChat.user._id);
//     console.log(onlineUsers);
//     console.log("SenderUser:Socket",sendUserSocket);
//     // console.log(sendUserSocket);
//     if (sendUserSocket) {
//       console.log("Line 79");
//       console.log(data);
//       console.log(data.msg);
//       if(data.msg==null)
//       socket.to(sendUserSocket).emit("msg-recieve","Value");
//       else 
//       socket.to(sendUserSocket).emit('msg-recieve',data.msg);
//     }
//     // socket.on("disconnect", () => {
//     //   for (const [userId, socketId] of onlineUsers.entries()) {
//     //     if (socketId === socket.id) {
//     //       onlineUsers.delete(userId);
//     //       break;
//     //     }
//     //   }
//       // console.log(onlineUsers.keys());
//       // io.emit("update-user-status", Array.from(onlineUsers.keys())); // Broadcast updated user status
//     // });
//   });
// });
