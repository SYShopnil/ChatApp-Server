const express = require('express');
const route = express.Router ();
const auth = require('../../../middleware/auth');
const {
    getAllConversationsBetweenTwoUsers,
    getOwnChatBoxHandler
} = require('./controller')

route.post ("/get", auth, getAllConversationsBetweenTwoUsers)
route.get ("/show/chatBox", auth, getOwnChatBoxHandler)


module.exports = route