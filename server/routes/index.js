const express = require("express");
const router = express.Router();

// Middleware and Controllers
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardData } = require("../controllers/dashboardController");

// Importing Route Files
const authRoutes = require("./auth");
const messageRoutes = require("./messageRoutes");
const conversationRoute = require("./conversationRoutes");
const uploadRoutes = require("./uploadRoutes");
const userRoutes = require("./userRoutes");

// --- Public Routes ---
router.use("/auth", authRoutes);

// --- Protected Routes ---
router.use(authMiddleware);

router.use("/upload", uploadRoutes);
router.use("/messages", messageRoutes);
router.use("/user", userRoutes);
router.use("/conversations", conversationRoute);
router.get("/dashboard", getDashboardData);

module.exports = router;
