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
    // console.log("Received query:", req.query);
    if (!fromCity || !toCity || !travelDate) {
      return res
        .status(400)
        .json({ message: "From city, to city, and travel date are required" });
    }

    const travelDateStart = new Date(travelDate);
    if (travelDateStart < new Date()) {
      return res
        .status(400)
        .json({ message: "Travel date cannot be in the past" });
    }
    const travelDateEnd = new Date(travelDate);
    travelDateEnd.setHours(23, 59, 59, 999);

    const matchingRoutes = await Route.find({
      source: new RegExp(`^${fromCity.trim()}$`, "i"),
      destination: new RegExp(`^${toCity.trim()}$`, "i"),
    });
    // console.log("Matching routes:", matchingRoutes);

    if (matchingRoutes.length === 0) {
      return res
        .status(404)
        .json({ message: `No routes found from ${fromCity} to ${toCity}` });
    }

    const routeIds = matchingRoutes.map((route) => route._id);
    let query = {
      routeId: { $in: routeIds },
      departureTime: { $gte: travelDateStart, $lte: travelDateEnd },
    };

    if (liveTracking === "true") query.liveTracking = true;
    if (primo === "true") query.primo = true;
    if (busTypes) {
      const types = busTypes.split(",");
      query.type = { $in: types };
    }
    if (seatsAvailable) {
      query.seatsAvailable = { $gte: parseInt(seatsAvailable) };
    }

    // console.log("Bus query:", query);
    const buses = await Bus.find(query).populate(
      "routeId",
      "source destination distance duration"
    );
    // console.log("Buses found:", buses);

    if (buses.length === 0) {
      return res
        .status(404)
        .json({ message: "No buses available for the selected criteria" });
    }

    // logger.info("Buses fetched", { fromCity, toCity, count: buses.length });
    res.status(200).json({ buses });
  } catch (error) {
    logger.error("Error fetching buses", { error });
    res.status(500).json({ message: "Failed to fetch buses" });
  }
});

module.exports = router;
