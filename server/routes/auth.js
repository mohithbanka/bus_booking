const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const router = express.Router();

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Register (Local)
router.post("/register", async (req, res) => {
  // logger.info("POST /auth/register called");
  try {
    const { email, password, name } = req.body;
    // console.log(req.body);
    
    if (!email || !password || !name) {
      // logger.warn("Register: Missing required fields");
      return res.status(400).json({ message: "Email, password, and name are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // logger.warn(`Register: Email ${email} already registered`);
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });
    await user.save();
    // logger.info(`Register: User ${email} created successfully`);

    const token = generateToken(user);
    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    // logger.error("Register: Error", { error });
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login (Local)
router.post("/login", (req, res, next) => {
  // logger.info("POST /auth/login called");
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      // logger.error("Login: Authentication error", { err });
      return next(err);
    }
    if (!user) {
      // logger.warn("Login: Authentication failed", { info });
      return res.status(401).json({ message: info.message || "Invalid email or password" });
    }
    const token = generateToken(user);
    logger.info(`Login: User ${user.email} logged in successfully`);
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  })(req, res, next);
});

// Google OAuth
router.get("/google", (req, res, next) => {
  logger.info("GET /auth/google called");
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google OAuth Callback
router.get("/google/callback", (req, res, next) => {
  // logger.info("GET /auth/google/callback called");
  passport.authenticate("google", { session: true }, (err, user) => {
    if (err) {
      logger.error("Google callback: Authentication error", { err });
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
    if (!user) {
      logger.warn("Google callback: Authentication failed");
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
    req.login(user, (err) => {
      if (err) {
        logger.error("Google callback: Session login error", { err });
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
      }
      logger.info(`Google callback: User ${user.email} logged in successfully`);
      const token = generateToken(user);
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    });
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res) => {
  // logger.info("POST /auth/logout called");
  req.logout((err) => {
    if (err) {
      logger.error("Logout: Error", { err });
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        logger.error("Logout: Session destroy error", { err });
        return res.status(500).json({ message: "Logout failed" });
      }
      logger.info("Logout: User logged out successfully");
      res.json({ message: "Logout successful" });
    });
  });
});

// Check authentication (protected route)
router.get("/me", require("../middleware/auth"), (req, res) => {
  logger.info("GET /auth/me called");
  res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.name } });
});

module.exports = router;