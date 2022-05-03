const express = require('express');
const route = express.Router ();
const {
    createUserHandler,
    showALlUserHandlerWithSearch,
    loginHandler
} = require('./controller')

route.post ("/register", createUserHandler)
route.post ("/show/all", showALlUserHandlerWithSearch)
route.post ("/login", loginHandler)

module.exports = route