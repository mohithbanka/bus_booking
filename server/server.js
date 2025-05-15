const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const winston = require("winston");

dotenv.config();

// Initialize Passport
try {
  require("./config/passport");
  // console.log("Passport configuration loaded successfully");
} catch (error) {
  console.error("Failed to load Passport configuration:", error);
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const busRoutes = require("./routes/buses");
const bookingRoutes = require("./routes/bookings");
const apiRoutes = require("./routes/api"); // Add this
const logger = require("./utils/logger");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
});
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);

// Connect to MongoDB
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
app.use("/api", apiRoutes); // Add this

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Bus Booking API" });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error("Server error", { error: err.message, stack: err.stack });
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});