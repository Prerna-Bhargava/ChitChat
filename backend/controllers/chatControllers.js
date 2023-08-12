const Chat = require('../models/chatModel')
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// create a chat from user id or return the chat if exists
const accessChat = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { userId } = req.body;
    var ischat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage")

    ischat = await User.populate(ischat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (ischat.length > 0)
        res.send(ischat[0])
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdchat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdchat._id }).populate("users", '-password')
            res.status(200)
            res.send(FullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    try {

        var chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 })

        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email"
        })

        res.status(200)
        res.send(chats)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

const createGroupChat = asyncHandler(async (req, res) => {
    console.log(req.body)
    var users = req.body.users;
    if (users.length < 2) {
        return res.status(400).send("More than 2 users are needed to create a group chat")
    }
    users.push(req.user)

    try {
        const chat = await Chat.create({
            chatName: req.body.chatName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        console.log("chat created ", chat)
        const groupChat = await Chat.findOne({ _id: chat._id }).populate("users", "-password").populate("groupAdmin", "-password")
        res.status(200).send(groupChat)

    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})

const removeFromGroup = asyncHandler(async (req, res) => {

    const { chatId, userId } = req.body;
    console.log(req.body)

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            res.status(404);
            throw new Error("Chat not found");
        }

        const isGroupAdmin = chat.groupAdmin.toString() === userId.toString();
        if (isGroupAdmin) {
            // Remove the user from the group's users array
            chat.users = chat.users.filter(
                (user) => user.toString() !== userId.toString()
            );
            
            if (chat.users.length === 0) {
                // If there are no users left in the group, delete the chat
                await Chat.findByIdAndDelete(chatId);
                res.status(200).send({ message: "Group chat deleted" });
                return;
            }
            // const newGroupAdminIndex = Math.floor(
            //     Math.random() * chat.users.length
            // );
            // chat.groupAdmin = chat.users[newGroupAdminIndex];
            const remainingUsers = chat.users.filter(
                (user) => user.toString() !== userId.toString()
            );
            console.log(remainingUsers)
            const newGroupAdminIndex = Math.floor(Math.random() * remainingUsers.length);
            chat.groupAdmin = remainingUsers[newGroupAdminIndex];
    
            // Save the updated chat
            await chat.save();

            // Save the updated chat
            await chat.save();

            const updatedChat = await Chat.findById(chatId)
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            res.status(200).send(updatedChat);
        } else {
            console.log("not admin")
            const updatedChat = await Chat.findByIdAndUpdate(chatId,
                {
                    $pull: { users: userId },
                },
                {
                    new: true
                }).populate("users", "-password").populate("groupAdmin", "-password")

            res.status(200).send(updatedChat);
        }

    } catch (error) {
        res.status(400);
        throw new Error("Failed to remove user from group");
    }

})

const addToGroup = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { chatId, userIds, chatName } = req.body;
    userIds.push(req.user)
    try {
        const updatedchat = await Chat.findByIdAndUpdate(chatId,
            {
                chatName: chatName,
                users: userIds
            },
            {
                new: true
            }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage")

        console.log(updatedchat)
        const chats = await User.populate(updatedchat, {
            path: "latestMessage.sender",
            select: "name pic email"
        })
        res.status(200).send(chats)

    } catch (error) {
        res.status(400);
        throw new Error("Chat Not Found")
    }

})

module.exports = { accessChat, fetchChats, createGroupChat, removeFromGroup, addToGroup }
