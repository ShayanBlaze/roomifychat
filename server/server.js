require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const { getDashboardData } = require("./controllers/dashboardController");

app.use(express.json());
app.use(cors());

app.get("/api/v1", (req, res) => {
  res.send("Welcome to Roomify Chat API");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", authMiddleware, getDashboardData);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  const db = await connectDB();
  console.log(`Server is running on port ${PORT}`);
});