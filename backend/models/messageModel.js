/*
sender name/id
chat refernece
content
*/

const mongoose = require('mongoose');

const msgModel = mongoose.Schema(
    {

        content: { type: String },
        chat: {
            type: mongoose.Schema.Types.ObjectId, //will specify/reference the id of the chat it belongs to.
            ref: "Chat",
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId, //will specify/reference the id of the user from actual users model
            ref: "User",
        },
        seenStatus: [{
            _id: false,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            seen: {
                type: Boolean,
                default: false,
            },
        }],
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", msgModel);
module.exports = Message;

