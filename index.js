const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require ("cors");

const UserRoute = require('./src/api/User/route');
const ChatRoute = require('./src/api/Chat/route');
const MessageRoute = require('./src/api/Message/route');


//rest


//gql 


//env file
const url = process.env.SERVER_URL || 8080
const mongoUrl = process.env.MONGO_URL
const corsOption = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
}

//parser and others middleware part
app.use (express.json({limit: "250mb"}))
app.use (express.urlencoded({extended: true, limit: "250mb"}))
app.use (express.static("public"))
app.use(cookieParser())
app.use (cors(corsOption))

//connect to the database
mongoose.connect (mongoUrl, {
    useUnifiedTopology: true,
})
.then (() => console.log(`Server is connected to the database`))
.catch (err => console.log(err))



//create a server instance
app.listen (url, () => console.log(`Server is running on ${url}`))

//base route
app.get ("/", (req, res) => {
    res.send (`I am from root`)
})

//all rest api
app.use ("/user", UserRoute)
app.use ("/chat", ChatRoute)
app.use ("/message", MessageRoute)

//page not found route
app.get ("*", (req, res) => {
    res.send (`404 Page not found`)
})