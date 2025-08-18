const { Server } = require("socket.io");
const { initializeSocket } = require("./socketHandler");

const setupSocket = (server) => {
  const allowedOrigins = [process.env.CLIENT_URL, process.env.DEV_URL];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
  });

  initializeSocket(io);

  return io;
};

module.exports = setupSocket;
