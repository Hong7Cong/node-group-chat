// app.js
// const http = require("http");
// const { Server } = require("socket.io");
const express = require("express");
const path = require("path");
const Room = require("./room");

const app = express();
const http = require('http').Server(app);
app.use(express.static(path.join(__dirname, "public")));

// const server = http.createServer(app);

const io = require('socket.io')(http);

const room = new Room();

io.on("connection", async (socket) => {
  const roomID = await room.joinRoom();
  // join room
  socket.join(roomID);

  socket.on("send-message", (message) => {
    socket.to(roomID).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    // leave room
    room.leaveRoom();
  });
});

// io.on("error", (err) => {
//   console.log("Error opening server");
// });

const server = http.listen(8080, function() {
  console.log('listening on *:8080');
});
