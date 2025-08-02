require("dotenv").config();

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const express = require("express");
const app = express();
const server = http.createServer(app);

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const { getDashboardData } = require("./controllers/dashboardController");
const Message = require("./models/Message");
const messageRoutes = require("./routes/messageRoutes");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

app.get("/api/v1", (req, res) => {
  res.send("Welcome to Roomify Chat API");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", authMiddleware, getDashboardData);
app.use("/api/v1/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("testMessage", (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);

    socket.broadcast.emit("testMessage", msg);
  });

  socket.on("chatMessage", async (data) => {
    const message = new Message({
      content: data.content,
      sender: data.senderId,
      chat: "general",
    });

    const savedMessage = await message.save();
    const populatedMessage = await savedMessage.populate("sender", "name");

    io.emit("chatMessage", populatedMessage);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  const db = await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
