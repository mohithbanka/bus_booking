const express = require("express");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      fromCity,
      toCity,
      travelDate,
      liveTracking,
      primo,
      busTypes,
      seatsAvailable,
    } = req.query;

    // Log incoming query parameters
    logger.debug("Received query parameters", { query: req.query });

    // Input validation
    if (!fromCity || !toCity || !travelDate) {
      logger.warn("Missing required query parameters", { query: req.query });
      return res.status(400).json({ message: "From city, to city, and travel date are required" });
    }

    // Validate and parse travelDate
    const travelDateObj = new Date(travelDate);
    if (isNaN(travelDateObj.getTime())) {
      logger.warn("Invalid travel date format", { travelDate });
      return res.status(400).json({ message: "Invalid travel date format" });
    }

    // Prevent past travel dates (compare dates only, not times)
    const currentDate = new Date();
    const travelDateOnly = new Date(Date.UTC(travelDateObj.getUTCFullYear(), travelDateObj.getUTCMonth(), travelDateObj.getUTCDate()));
    const currentDateOnly = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
    logger.debug("Date comparison", {
      travelDateOnly: travelDateOnly.toISOString(),
      currentDateOnly: currentDateOnly.toISOString(),
    });
    if (travelDateOnly < currentDateOnly) {
      logger.warn("Travel date is in the past", { travelDate, currentDate });
      return res.status(400).json({ message: "Travel date cannot be in the past" });
    }

    // Find matching routes (case-insensitive)
    const matchingRoutes = await Route.find({
      source: new RegExp(`^${fromCity.trim()}$`, "i"),
      destination: new RegExp(`^${toCity.trim()}$`, "i"),
    });

    if (matchingRoutes.length === 0) {
      logger.info("No routes found", { fromCity, toCity });
      return res.status(404).json({ message: `No routes found from ${fromCity} to ${toCity}` });
    }

    const routeIds = matchingRoutes.map((route) => route._id);

    // Build query for buses
    let query = { routeId: { $in: routeIds } };

    // Apply filters
    if (liveTracking === "true") query.liveTracking = true;
    if (primo === "true") query.primo = true;
    if (busTypes) {
      const types = busTypes.split(",").map((type) => type.trim());
      query.type = { $in: types };
    }
    if (seatsAvailable) {
      const seats = parseInt(seatsAvailable);
      if (isNaN(seats) || seats < 1) {
        logger.warn("Invalid seatsAvailable value", { seatsAvailable });
        return res.status(400).json({ message: "Seats available must be a positive number" });
      }
      query.seatsAvailable = { $gte: seats };
    }

    // Fetch buses
    const buses = await Bus.find(query).populate(
      "routeId",
      "source destination distance duration"
    );

    if (buses.length === 0) {
      logger.info("No buses available", { query });
      return res.status(404).json({ message: "No buses available for the selected criteria" });
    }

    // Adjust departureTime and arrivalTime to the user-selected travelDate
    const adjustedBuses = buses
      .map((bus) => {
        const departureTime = new Date(bus.departureTime);
        const arrivalTime = new Date(bus.arrivalTime);

        // Combine the time part with the user-selected travelDate
        const adjustedDeparture = new Date(travelDate);
        adjustedDeparture.setUTCHours(
          departureTime.getUTCHours(),
          departureTime.getUTCMinutes(),
          departureTime.getUTCSeconds(),
          departureTime.getUTCMilliseconds()
        );

        const adjustedArrival = new Date(travelDate);
        adjustedArrival.setUTCHours(
          arrivalTime.getUTCHours(),
          arrivalTime.getUTCMinutes(),
          arrivalTime.getUTCSeconds(),
          arrivalTime.getUTCMilliseconds()
        );

        // If arrival time is earlier than departure time, it means the trip spans to the next day
        if (adjustedArrival < adjustedDeparture) {
          adjustedArrival.setDate(adjustedArrival.getDate() + 1);
        }

        return {
          ...bus.toObject(),
          departureTime: adjustedDeparture,
          arrivalTime: adjustedArrival,
        };
      })
      // Filter out buses that have already departed if travelDate is today
      .filter((bus) => {
        const isToday =
          travelDateOnly.getFullYear() === currentDateOnly.getFullYear() &&
          travelDateOnly.getMonth() === currentDateOnly.getMonth() &&
          travelDateOnly.getDate() === currentDateOnly.getDate();
        if (!isToday) return true; // No filtering for future dates
        return bus.departureTime > currentDate; // Only include buses departing after current time
      });

    if (adjustedBuses.length === 0) {
      logger.info("No buses available after time filter", { query, currentDate });
      return res.status(404).json({ message: "No buses available for the selected criteria" });
    }

    logger.info("Buses fetched successfully", {
      fromCity,
      toCity,
      travelDate,
      count: adjustedBuses.length,
    });
    res.status(200).json({ buses: adjustedBuses });
  } catch (error) {
    logger.error("Error fetching buses", { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Failed to fetch buses" });
  }
});

module.exports = router;