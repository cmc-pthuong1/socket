const { Server } = require("socket.io");

class DeviceService {
  constructor({ io }) {
    this.devices = {};
    this.io = io;
  }

  registerDevice(data, socket) {
    const { deviceId, status } = data;
    this.devices[deviceId] = { socketId: socket.id, status };
    console.log("Device registered:", this.devices);
  }

  disconnectDevice(data, socket) {
    const { deviceId } = data;
    console.log("A device disconnected:", socket.key);
    for (const id in this.devices) {
      if (this.devices[id].socketId === socket.key && id == deviceId) {
        delete this.devices[deviceId];
        console.log("Device unregistered:", deviceId);
        break;
      }
    }
  }

  disconnect(socket) {
    console.log("A device disconnected:", socket.key);
    for (const deviceId in this.devices) {
      if (this.devices[deviceId].socketId === socket.key) {
        delete this.devices[deviceId];
        console.log("Device unregistered:", deviceId);
        break;
      }
    }
  }

  startSendingEvents(io) {
    setInterval(() => {
      for (const deviceId in this.devices) {
        const randomEvent = {
          event: "pushData",
          deviceId: deviceId,
          status: "active",
          flowRate: (Math.random() * 5 + 1).toFixed(1),
          pressure: (Math.random() + 1).toFixed(1),
        };
        io.to(this.devices[deviceId].socketId).emit("event", randomEvent);
      }
    }, 2000);
  }
}

module.exports = DeviceService;
