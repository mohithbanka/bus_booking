const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
});

// Generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Input validation for registration
const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, and one number"
    ),
  body("name").trim().notEmpty().withMessage("Name is required"),
];

// Register (Local)
router.post("/register", authLimiter, registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      provider: "local",
      role: "user",
    });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Input validation for login
const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Login (Local)
router.post("/login", authLimiter, loginValidation, (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Local login error:", err);
      return res.status(500).json({ message: "Authentication error" });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  })(req, res, next);
});

// Google OAuth
router.get(
  "/google",
  (req, res, next) => {
    res.clearCookie("jwt");
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
    state: Date.now().toString(),
  })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    failureMessage: true,
  }),
  async (req, res) => {
    try {
      // console.log("Google callback: User authenticated", req.user ? req.user.email : "No user");
      if (!req.user) {
        const errorMessage = req.authInfo?.message || "Authentication failed";
        // console.log("Google callback: Authentication failed", errorMessage);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(errorMessage)}`
        );
      }
      const token = generateToken(req.user);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }
);

// Logout
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("jwt");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});

// Check authentication
router.get("/me", require("../middleware/auth"), (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      phone: req.user.phone,
      avatar: req.user.avatar,
    },
  });
});

module.exports = router;