const express = require('express');
const route = express.Router ();
const auth = require('../../../middleware/auth');
const {
    createNewMessageHandler
} = require('./controller')

route.post ("/sent/:chatId", auth, createNewMessageHandler)


module.exports = route