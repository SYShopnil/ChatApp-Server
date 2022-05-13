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
} = require("socket.io")
const io = new Server (server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
    }
}) //setup the socket server instance

const onlineUser = []

io.on ("connection", (socket) => {
  //when a new user will ber s
  socket.on("active", (activeUser) => {
    const active = {}
    //check 1st that same user already active or not 
    let isActive = false;
    onlineUser.forEach (user => {
      for  (key in user) {
        if (key == activeUser) {
          isActive = true
        }
      }
    })

    //if already active then just update the socket id of that key other wise add a new user to the onlineUser
    if (isActive) { //update the socket id of that active user
      onlineUser.forEach ((user, ind) => {
      for  (key in user) {
        if (key == activeUser) {
          onlineUser[ind][key] = socket.id
        }
      }
    })
    }else { //creat a new user as a active user and set the socket id
      active [activeUser] = socket.id
      onlineUser.push (active)
    }
    socket.join (activeUser)//create a room for active user
    // console.log({onlineUser})
    // console.log(`Active end`)
  })

  socket.on ("joinChat", (chatID) => {
    socket.join (chatID)
  })

  socket.on ("typing", (chatID) => {
    socket.in (chatID).emit ("startTyping")
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
    // console.log({messageInfo})
    chatMembers.forEach(member => {
      if (member._id == sendBy) return member
      const sendData = {
        chatId,
        participant:member._id 
      }
      // let senderSocketId;
      // onlineUser.forEach (user => {
      //   for (key in user) {
      //     console.log({key, user})
      //     if (key == member._id) {
      //       senderSocketId = user [key]
      //     }
      //   }
      // });
      // console.log(`New message send`)
      // console.log({onlineUser})
      // console.log({senderSocketId})
      // senderSocketId && io.emit ("messageReceive", sendData)
      // senderSocketId && io.sockets.to (senderSocketId).emit ("messageReceive", sendData)
      io.sockets.in (chatId).emit ("messageReceive", sendData)
    })
  })
})




// io.on ("connection", (socket) => {
//   //when a new user will ber s
//   socket.on("active", (activeUser) => {
//     console.log(`${activeUser} user is connected`)
//     socket.join (activeUser)//create a room for active user
//     socket.emit ("connected");
//   })

//   socket.on ("joinChat", (chatID) => {
//     // console.log(`User is joined chat id ${chatId}`)
//     console.log(chatID)
//     socket.join (chatID)
//   })
//   socket.on ("newMessage", (messageInfo) => {
//     const {
//       sendBy,
//       chatMembers,
//       chatId
//     } = messageInfo //get the emit data 
//     // console.log({messageInfo})
//     chatMembers.forEach(member => {
//       if (member._id == sendBy) return member
//       const sendData = {
//         chatId,
//         participant:member._id 
//       }
//       let senderSocketId;
//       console.log(`Message need to sent to ${member._id }`)
//       // io.to(senderSocketId).emit ("messageReceive", sendData)
//       io.to(chatId).emit ("messageReceive", sendData)
//     })
//   })

//   socket.on ("disconnect", () => {
//     console.log(`Disconnected`)
//   })
// })