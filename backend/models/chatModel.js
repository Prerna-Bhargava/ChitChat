/*
users(array)
latestMessage(as we will show thaton screen)
isgroupChat
chatname
group admin(if)
*/

const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId, //will specify/reference the id of the user from actual users model
                ref: "User",
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId, //will specify/reference the id of the meesage from actual message model
            ref: "Message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId, //will specify/reference the id of the user from actual users model
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;

