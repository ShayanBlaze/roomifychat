const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

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

// --- Middlewares ---
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/api", limiter);

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
