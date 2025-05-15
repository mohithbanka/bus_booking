const express = require("express");
const { check, validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const authMiddleware = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// Validation middleware for booking creation
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

    // Check if seats are already booked
    const existingBooking = await Booking.findOne({
      busId,
      journeyDate,
      seatNumbers: { $in: seatNumbers },
      status: { $ne: "cancelled" },
    });
    if (existingBooking) {
      return res.status(400).json({ message: "One or more seats are already booked" });
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
    // logger.info("Booking created", { userId: req.user.id, bookingId: booking._id });
    res.status(201).json({ booking });
  } catch (error) {
    // logger.error("Error creating booking", { error: error.message, stack: error.stack });
    res.status(500).json({ message: error.message || "Failed to create booking" });
  }
});

// Get User Bookings (for UserProfilepage and MyTrips)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // logger.info("Getting user bookings", { userId: req.user.id });
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("busId", "busNumber operator type price departureTime arrivalTime")
      .populate("routeId", "source destination distance duration")
      .sort({ journeyDate: -1 });

    // Adjust departure and arrival times to journey date
    const adjustedBookings = bookings.map((booking) => {
      const journeyDate = new Date(booking.journeyDate);
      const departureTime = new Date(booking.busId.departureTime);
      const arrivalTime = new Date(booking.busId.arrivalTime);

      const adjustedDeparture = new Date(journeyDate);
      adjustedDeparture.setUTCHours(
        departureTime.getUTCHours(),
        departureTime.getUTCMinutes(),
        departureTime.getUTCSeconds()
      );

      const adjustedArrival = new Date(journeyDate);
      adjustedArrival.setUTCHours(
        arrivalTime.getUTCHours(),
        arrivalTime.getUTCMinutes(),
        arrivalTime.getUTCSeconds()
      );
      if (adjustedArrival <= adjustedDeparture) {
        adjustedArrival.setUTCDate(adjustedArrival.getUTCDate() + 1);
      }

      return {
        ...booking.toObject(),
        busId: {
          ...booking.busId.toObject(),
          departureTime: adjustedDeparture,
          arrivalTime: adjustedArrival,
        },
      };
    });

    res.status(200).json({ bookings: adjustedBookings });
  } catch (error) {
    // logger.error("Error fetching bookings", { userId: req.user.id, error: error.message, stack: error.stack });
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

module.exports = router;