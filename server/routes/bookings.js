const express = require("express");
const { check, validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const authMiddleware = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// Validation middleware
const bookingValidation = [
  check("busId").isMongoId().withMessage("Invalid bus ID"),
  check("seatNumbers").isArray({ min: 1 }).withMessage("At least one seat number is required"),
  check("journeyDate").isISO8601().withMessage("Invalid journey date"),
  check("totalAmount").isFloat({ min: 0 }).withMessage("Total amount must be a positive number"),
];

// Create Booking
router.post("/", authMiddleware, bookingValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { busId, seatNumbers, journeyDate, totalAmount } = req.body;
    const bus = await Bus.findById(busId).populate("routeId");
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      busId,
      routeId: bus.routeId._id,
      seatNumbers,
      journeyDate,
      totalAmount,
      status: "confirmed", // Simplified; use "pending" with Payment model
    });

    await booking.save();
    logger.info("Booking created", { userId: req.user.id, bookingId: booking._id });
    res.status(201).json({ booking });
  } catch (error) {
    logger.error("Error creating booking", { error });
    res.status(400).json({ message: error.message || "Failed to create booking" });
  }
});

// Get User Bookings (for /my-trips)
router.get("/my-trips", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("busId", "busNumber operator type price departureTime arrivalTime")
      .populate("routeId", "source destination distance duration")
      .sort({ journeyDate: -1 });
    res.json({ bookings });
  } catch (error) {
    logger.error("Error fetching bookings", { error });
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

module.exports = router;