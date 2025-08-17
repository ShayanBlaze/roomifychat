const express = require("express");
const cors = require("cors");
const path = require("path");

const mainApiRouter = require("./routes");

const app = express();

// --- CORS Setting ---
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

// --- Middleware ها ---
app.use(cors(corsOptions));
app.use(express.json());

// --- Routes ---
app.get("/api/v1", (req, res) => res.send("Welcome to Roomify Chat API"));
app.use("/api/v1", mainApiRouter);

// --- Serving Frontend in Production ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

module.exports = app;
