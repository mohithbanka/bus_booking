// server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const winston = require("winston");

dotenv.config();

// Passport Config
try {
  require("./config/passport");
} catch (error) {
  console.error("Failed to load Passport configuration:", error);
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const busRoutes = require("./routes/buses");
const bookingRoutes = require("./routes/bookings");
const apiRoutes = require("./routes/api");
const logger = require("./utils/logger");

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-domain.vercel.app", // Replace with your deployed frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
});
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => {
    logger.error("Error connecting to MongoDB", { error });
    process.exit(1);
  });

// Routes
app.use("/auth", authRoutes);
app.use("/buses", busRoutes);
app.use("/bookings", bookingRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Bus Booking API" });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error("Server error", { error: err.message, stack: err.stack });
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});