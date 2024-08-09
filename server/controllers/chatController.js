const { request } = require("http");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Messages = require('../models/messageModel');
const cloudinary = require("../cloudinary/cloudinary");

module.exports.accessChat = async (req, res,next) => {
    const { users } = req.body;
    // return res.send("Working 3");
    // console.log("from",from);
    // console.log("to",to);

    // if (!to) {
    //     return res.status(400).json("No user provided");
    // }
    // console.log(users);
    users.sort();
    try {
        const isChat = await Chat.find({
            isGroupChat: false,
            users: { $all: users }  
          }).populate({
            path: 'users',
            select: 'username email avatarImage',
          })
          .populate({
            path: 'latestMessage',
            select: 'message',
          })
          .exec();
        // console.log('Chat at line 22', isChat);
         
        // const populatedChat = await Chat.populate(isChat, {
        //     path: 'users',
        //     select: 'username email avatarImage'
        // }).populate({
        //     path: 'latestMessage',
        //     select: 'message'
        // });
        //   return res.send(populatedChat);
        // console.log('Chat at line 23', populatedChat);

        if (isChat.length > 0) {
            return res.send(isChat[0]);
          }
          else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users,
                latestMessage:null,
                Time: new Date()
            };
            const newChat = await Chat.create(chatData);
            // console.log(newChat);
            const FullChat = await Chat.findOne({ _id: newChat._id });
            // console.log(FullChat._id);
            return res.status(200).send(newChat._id);
        }
    } catch (ex) {
        console.error("Error in chatCreation", ex);
        next(ex);
    }
}

module.exports.fetchChat = async (req, res, next) => {
    // console.log("line-53 fetchChat",req.params);
    try {
        const chats = await Chat.find({ users: { $elemMatch: { $eq: req.params.id } } })
        .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
        .populate({
          path: 'users',
          select: 'username email avatarImage',
        })
        .populate({
          path: 'latestMessage',
          select: 'message',
        });
        // console.log("connectUser",chats);
        return res.status(200).send(chats);
    } catch (err) {
        console.log("fest chat error",err);
        next(err);
    }
}

module.exports.fetchGroups = async (req, res, next) => {
    try {
        const allGroups = await Chat.find({isGroupChat:true});
        // console.log(allGroups);
        return res.status(200).send(allGroups);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports.createGroupChat = async (req, res, next) => {
    console.log(req.body);
    if (!req.body.user || !req.body.name || !req.body.image) {
        console.log("misisng field");
        return res.status(400).json("Users and chatName are required");
    }
    try{
        // console.log("console", req.body.users);
        // const users = JSON.parse(req.body.users);
        // console.log(req.user);
        // users.push(req.body.user);
        const uploadImage = await cloudinary.uploader.upload(req.body.image.base64, {
            upload_preset: 'gocj9ra1',
          });
        //   console.log("Line 127 uploadImage - Group", uploadImage.url);
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users:[req.body.user],
            groupAdmin: req.body.user,
            chatImage: uploadImage.url
        });
        // console.log("groupChat", groupChat);
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        return res.status(200).send(fullGroupChat);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports.exitGroup = async (req, res, next) => {
    if (!req.body.chatId) {
        return res.status(400).json("chatId is required");
    }
    try {
        const { chatId, userId , isGroupChat } = req.body;
        const Admin = await Chat.findOne({ _id: chatId });
        if(!isGroupChat)
        return res.status(400).json("Only group admins can exit group");
        // console.log(userId);
        // const groupAdmin=JSON.stringify(Admin.groupAdmin);
        // console.log(Admin.groupAdmin.toString());
        const groupAdmin = Admin.groupAdmin.toString();
        if (groupAdmin !== userId) {
            const removed = await Chat.findByIdAndUpdate(chatId,{
                $pull: { users: userId }
            })
            if (!removed) {
                return res.status(404).json("User not found in this chat");
            } else {
                return res.status(200).json(removed);
            }
        } else {
            console.log("Working");
            const groupDelete = await Chat.findByIdAndDelete(chatId);
            return res.status(200).json(groupDelete);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports.addSelf = async (req, res, next) => {
    const { chatId, userId } = req.body;
    console.log(chatId);
    console.log(userId);
    try {
        const added = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },
            { new: true }
        )
        // console.log(added);
        if (!added) {
            return res.status(404).json("User not found in this chat");
        } else {
            return res.status(200).json(added);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
}
