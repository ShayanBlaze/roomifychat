require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db");
const app = require("./app");
const { initializeSocket } = require("./socket/socketHandler");

const server = http.createServer(app);

const io = require("./socket")(server);

app.set("socketio", io);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully.");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

startServer();
