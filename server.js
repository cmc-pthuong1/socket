const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn (có thể thay bằng URL cụ thể)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  setInterval(() => {
    const messageObject = {
      t: (Math.random() + 25).toFixed(1),
      p: (Math.random() + 1).toFixed(1),
      q: (Math.random() * 5 + 1).toFixed(1),
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", messageObject);
  }, 2000);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message", (msg) => {
    console.log("Message received: " + msg);
    io.emit("message", msg); // Phát lại tin nhắn cho tất cả người dùng
  });
});

server.listen(3000, () => {
  console.log("Socket server is running on http://localhost:3000");
});
