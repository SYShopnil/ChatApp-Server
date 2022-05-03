const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema ({
    name: String,
    sex: String,
    profilePic: String,
    isDelete: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model ("User", userSchema)