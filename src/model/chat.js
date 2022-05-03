const mongoose = require('mongoose');
const Schema = mongoose.Schema

const chatSchema = new Schema ({
    chatName: {
        type: String,
        default: "Untitled"
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: String,
        default: ""
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

module.exports = mongoose.model ("Chat", chatSchema)