const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require ("cors");

const UserRoute = require('./src/api/User/route');
const ChatRoute = require('./src/api/Chat/route');
const MessageRoute = require('./src/api/Message/route');
const {
  addUser,
  removeUser,
  findUserSocketId
} = require('./src/socket/messageController')


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
const server =  app.listen (url, () => console.log(`Server is running on ${url}`))

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

//===================== socket io part ==========================//
const {
  Server
} = require("socket.io");
const user = require('./src/model/user');
const io = new Server (server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
    }
}) //setup the socket server instance


//Old one
io.on ("connection", (socket) => {
  //when a new user will ber s
  socket.on("active", (userID) => {
    addUser (userID, socket.id)
    socket.emit ("connected");
  })

  socket.on ("joinChat", (chatID) => {
    socket.join (chatID)
  })

  socket.on ("typing", (chatID) => {
    socket.in (chatID).emit ("startTyping", chatID)
  });
  socket.on ("typingFinish", (chatID) => {
    socket.in (chatID).emit ("stopTyping")
  })
  socket.on ("newMessage", (messageInfo) => {
    const {
      sendBy,
      chatMembers,
      chatId
    } = messageInfo //get the emit data 
    const senderId = sendBy //store the message sender id
    chatMembers.forEach(member => { //it will send notification of message received except the sender
      if (member._id == sendBy) return member
      const sendData = {
        chatId,
        participant:member._id ,
        sender: senderId
      }
      const getSocketId = findUserSocketId (member._id)
      if (getSocketId) {
        const senderSocketId = getSocketId.socketId
        io.to (senderSocketId).emit ("messageReceive", sendData ) 
        io.sockets.in (chatId).emit ("messageReceive", sendData)
      }else {
        return
      }
    })
  })

  socket.on ("disconnectSocket", () => {
    const isRemove = removeUser (socket.id);
    if (isRemove) {
      socket.disconnect ();
    }
  })
  socket.on ("disconnect", () => {
    removeUser (socket.id);
  })
})


