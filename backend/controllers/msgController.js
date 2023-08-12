const Message = require('../models/messageModel')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    console.log(req.body)
    var msg = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }
    try {
        var getUsers = await Chat.findById(chatId)

        var message = await Message.create(msg);
        message = await message.populate("sender", "name pic email");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })

        // update chat model with latest message
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        })
        res.json(message);


    } catch (error) {

        res.status(400)
        throw new Error(error.message);

    }
})

const getAllMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const deleteMsg = asyncHandler(async (req, res) => {
    console.log("recived", req.params)
    try {
        const { msgId } = req.params;
        const isMsg = await Message.findById(msgId)
        if (!isMsg) {
            res.status(404);
            throw new Error("Msg not found");
        }
        await Message.findByIdAndDelete(msgId)
        res.status(200).send({ message: "Message deleted" });
        return;

    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
})

const getAllNotifications = asyncHandler(async (req, res) => {
    try {
        const unseenMessages = await Message.find({
            seenStatus: {
                $elemMatch: { user: req.params.userId, seen: false }
            }
        })
            .populate("sender", "name pic email")
            .populate("chat");
        res.status(200).send(unseenMessages);
    } catch (error) {
        console.error(error);
        res.status(400);
        throw new Error(error.message);

    }
});

const updateNotifications = asyncHandler(async (req, res) => {
    const { messageId, userId, isSeen } = req.body;

    try {
        const result = await Message.findOneAndUpdate(
            {
                _id: messageId,
                "seenStatus.user": userId
            },
            {
                $set: { "seenStatus.$.seen": isSeen }
            },
            { new: true }
        );

        if (!result) {
            const newResult = await Message.findOneAndUpdate(
                {
                    _id: messageId
                },
                {
                    $addToSet: { seenStatus: { user: userId, seen: isSeen } }
                },
                { new: true }
            );

            if (!newResult) {
                return res.status(404).send("Message not found.");
            }

            return res.status(200).send(newResult);
        }

        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

module.exports = { sendMessage, getAllMessage, getAllNotifications, updateNotifications, deleteMsg }