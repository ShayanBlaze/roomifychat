require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const initializeSocket = require("./socket/socketHandler");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoute = require("./routes/conversationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const { getDashboardData } = require("./controllers/dashboardController");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

app.use(cors());
app.use(express.json());

// --- Public Routes don't require authentication ---
app.get("/api/v1", (req, res) => res.send("Welcome to Roomify Chat API"));
app.use("/api/v1/auth", authRoutes);

// --- Middleware for all protected routes ---
app.use(authMiddleware);

// --- Protected Routes ---
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/conversations", conversationRoute);
app.use("/api/v1/dashboard", getDashboardData);

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
