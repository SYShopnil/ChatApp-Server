const express = require('express');
const route = express.Router ();
const auth = require('../../../middleware/auth');
const {
    getAllConversationsBetweenTwoUsers
} = require('./controller')

route.post ("/get", auth, getAllConversationsBetweenTwoUsers)


module.exports = route