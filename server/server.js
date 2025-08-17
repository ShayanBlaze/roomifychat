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
const path = require("path");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [process.env.CLIENT_URL, process.env.DEV_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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

app.use(express.json());

// --- Public Routes ---
app.get("/api/v1", (req, res) => res.send("Welcome to Roomify Chat API"));
app.use("/api/v1/auth", authRoutes);

// --- Protected Routes ---
app.use("/api/v1/upload", authMiddleware, uploadRoutes);
app.use("/api/v1/messages", authMiddleware, messageRoutes);
app.use("/api/v1/user", authMiddleware, userRoutes);
app.use("/api/v1/conversations", authMiddleware, conversationRoute);
app.get("/api/v1/dashboard", authMiddleware, getDashboardData);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

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
