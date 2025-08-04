// Load environment variables
require("dotenv").config();

// Core Node modules
const http = require("http");

// Third-party packages
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

// Local modules
const connectDB = require("./config/db");
const initializeSocket = require("./socket/socketHandler");

// Route imports
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const { getDashboardData } = require("./controllers/dashboardController");
const authMiddleware = require("./middleware/authMiddleware");

// --- App & Server Initialization ---
const app = express();
const server = http.createServer(app);

// --- Socket.io Initialization ---
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Pass the 'io' instance to the socket handler
initializeSocket(io);

// --- Core Middlewares ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.get("/api/v1", (req, res) => {
  res.send("Welcome to Roomify Chat API");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", authMiddleware, uploadRoutes);
app.use("/api/v1/messages", authMiddleware, messageRoutes);
app.use("/api/v1/user", authMiddleware, userRoutes);
app.use("/api/v1/dashboard", authMiddleware, getDashboardData);

// --- Server Listening ---
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
