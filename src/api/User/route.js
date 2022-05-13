const express = require('express');
const route = express.Router ();
const {
    createUserHandler,
    showALlUserHandlerWithSearch,
    loginHandler,
    isLoggedInCheckHandler,
    logoutHandler
} = require('./controller')
const auth = require('../../../middleware/auth')

route.post ("/register", createUserHandler)
route.post ("/show/all", auth, showALlUserHandlerWithSearch)
route.post ("/login", loginHandler)



//get api
route.get ("/check/login", auth, isLoggedInCheckHandler)
route.get ("/logout", auth, logoutHandler)

module.exports = route