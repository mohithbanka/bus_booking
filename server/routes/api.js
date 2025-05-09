const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Booking = require("../models/Booking");
const PaymentMethod = require("../models/Payment.js");

router.get("/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/payment-methods", authMiddleware, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ userId: req.user.id });
    res.json({ paymentMethods });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/payment-methods", authMiddleware, async (req, res) => {
  try {
    const { type, details } = req.body;
    const paymentMethod = new PaymentMethod({
      userId: req.user.id,
      type,
      details,
    });
    await paymentMethod.save();
    res.json({ message: "Payment method added", paymentMethod });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;