const express = require('express');
const route = express.Router ();
const {
    createUserHandler,
    showALlUserHandlerWithSearch,
    loginHandler,
    isLoggedInCheckHandler,
    logoutHandler,
    getUserInfoById
} = require('./controller')
const auth = require('../../../middleware/auth')

route.post ("/register", createUserHandler)
route.post ("/show/all", auth, showALlUserHandlerWithSearch)
route.post ("/login", loginHandler)



//get api
route.get ("/check/login", auth, isLoggedInCheckHandler)
route.get ("/logout", auth, logoutHandler)
route.get ("/get/individual/:id", auth, getUserInfoById)

module.exports = route