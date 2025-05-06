const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Models
const User = require("./models/User");
const Bus = require("./models/Bus");
const Route = require("./models/Route");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.headers["content-type"] === "text/plain") {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        req.body = JSON.parse(data);
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON format" });
      }
      next();
    });
  } else {
    next();
  }
});


// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// Passport Google OAuth Configuration
require("./auth/passportConfig.js"); // Passport configuration

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret", // Use environment variable for session secret
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from my server");
});

// Bus route with cities query\
app.get("/buses", async (req, res) => {
  try {
    console.log("Received Query Params:", req.query); // Debug log

    let { fromCity, toCity } = req.query;
    if (!fromCity || !toCity) {
      return res.status(400).json({ message: "Both cities are required" });
    }

    fromCity = fromCity.trim().toLowerCase();
    toCity = toCity.trim().toLowerCase();

    const matchingRoutes = await Route.find({
      source: { $regex: new RegExp(`^${fromCity}$`, "i") },
      destination: { $regex: new RegExp(`^${toCity}$`, "i") },
    });

    if (matchingRoutes.length === 0) {
      return res
        .status(404)
        .json({ message: `No routes found from ${fromCity} to ${toCity}` });
    }

    const routeIds = matchingRoutes.map((route) => route._id);
    const buses = await Bus.find({ route_id: { $in: routeIds } });

    if (buses.length === 0) {
      return res
        .status(404)
        .json({ message: `No buses available from ${fromCity} to ${toCity}` });
    }

    console.log("Buses Found:", buses); // Debug log
    return res.status(200).json({ buses });
  } catch (error) {
    console.error("Error fetching buses:", error.message);
    return res.status(500).json({ error: "Failed to fetch buses" });
  }
});

// User Registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log("Registration Data:", req.body);
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});


// User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Login Data:", req.body);
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h", // Adjust the expiration time as needed (e.g., "1h" for 1 hour, "2h" for 2 hours)
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Google OAuth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/my-profile", // Update with your front-end URL
    failureRedirect: "http://localhost:3000/my-profile", // Update with your front-end URL
  })
);

// Get User Profile (via JWT)
app.get("/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/my-profile",
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Optionally, you could also include user info here if needed
    res.redirect("http://localhost:3000/my-profile");
  }
);

app.listen(port, () => console.log(`Server running on port ${port}`));
