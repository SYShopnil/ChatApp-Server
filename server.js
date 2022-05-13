const express = require("express")
const socketIo = require("socket.io")
const http = require("http")
require("dotenv").config()
const PORT = process.env.SERVER_URL || 5000
const app = express()
const server = http.createServer(app)
const io = socketIo(server,{ 
    cors: {
      origin: "http://localhost:3000"
    }
}) //in case server and client run on different urls
io.on('connection',(socket)=>{
  socket.on ("send", (message) => {
    console.log(`Message send ${message}`)
    socket.emit ("receive", message)
  })
  socket.on('disconnect',(reason)=>{
    console.log(reason)
  })

 
})
server.listen(PORT, err=> {
  if(err) console.log(err)
  console.log(`Server running on Port`, PORT)
})
