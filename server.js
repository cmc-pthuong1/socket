const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const DeviceService = require("./service.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn (có thể thay bằng URL cụ thể)
    methods: ["GET", "POST"],
  },
});

// Khởi tạo DeviceService
const deviceService = new DeviceService({ io });

// Khi một thiết bị kết nối
io.on("connection", (socket) => {
  console.log("A device connected:", socket.id);

  // Đăng ký thiết bị
  socket.on("registerDevice", (data) => {
    deviceService.registerDevice(data, socket);
  });

  // Ngắt kết nối
  socket.on("disconnectDevice", (data) => {
    deviceService.disconnectDevice(data, socket);
  });

  socket.on("disconnect", () => {
    deviceService.disconnect(socket);
    console.log("A device disconnect");
  });
});

// Bắt đầu gửi sự kiện
deviceService.startSendingEvents(io);

server.listen(3000, () => {
  console.log("Socket server is running on http://localhost:3000");
});
