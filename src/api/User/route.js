const express = require('express');
const route = express.Router ();
const {
    createUserHandler,
    showALlUserHandlerWithSearch,
    loginHandler,
    isLoggedInCheckHandler
} = require('./controller')
const auth = require('../../../middleware/auth')

route.post ("/register", createUserHandler)
route.post ("/show/all", showALlUserHandlerWithSearch)
route.post ("/login", loginHandler)

//get api
route.get ("/check/login", auth, isLoggedInCheckHandler)

module.exports = route