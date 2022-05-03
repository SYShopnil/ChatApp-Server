const mongoose = require('mongoose');
const Schema = mongoose.Schema

const messageSchema = new Schema ({
    content: String,
    sendBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat"
    }
},{
    timestamps: true
})

module.exports = mongoose.model ("Message", messageSchema)