const mongoose = require("mongoose");
const Route = require("../models/Route");
const Bus = require("../models/Bus");
const logger = require("../utils/logger");
require("dotenv").config();

// List of cities (top 20 from INDIAN_CITIES in Header.jsx)
const INDIAN_CITIES = [
  "DELHI", "MUMBAI", "BANGALORE", "HYDERABAD", "CHENNAI", "KOLKATA",
  "AHMEDABAD", "PUNE", "JAIPUR", "LUCKNOW", "KANPUR", "NAGPUR",
  "INDORE", "THANE", "BHOPAL", "VISAKHAPATNAM", "PATNA", "VADODARA",
  "GHAZIABAD", "LUDHIANA"
];

// Helper function to create a Date object for a specific time on 1970-01-01
const createTimeOnReferenceDate = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date("1970-01-01T00:00:00Z");
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
};

// Helper function to calculate arrival time
const calculateArrivalTime = (departureTime, durationMinutes) => {
  const departureMs = departureTime.getTime();
  const durationMs = durationMinutes * 60 * 1000;
  return new Date(departureMs + durationMs);
};

// Generate routes
const generateRoutes = () => {
  const routes = [];
  for (let i = 0; i < INDIAN_CITIES.length; i++) {
    for (let j = i + 1; j < INDIAN_CITIES.length; j++) {
      const source = INDIAN_CITIES[i];
      const destination = INDIAN_CITIES[j];
      const distance = Math.floor(Math.random() * (2000 - 500 + 1)) + 500; // 500–2000 km
      const duration = Math.floor((distance / 50) * 60); // Minutes at 50 km/h
      routes.push({
        source,
        destination,
        distance,
        duration,
        isDeleted: false,
        createdAt: new Date(),
      });
    }
  }
  return routes;
};

// Generate buses
const generateBuses = (insertedRoutes) => {
  const operators = ["TravelCo", "FastTrack", "LuxuryLiner", "CityRide", "StarTravel", "ExpressLine", "QuickRide", "EcoTravel", "SkyBus", "SwiftRide"];
  const types = ["AC", "NonAC", "Sleeper", "Seater"];
  const times = ["06:00:00", "08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00", "22:00:00"];
  const buses = [];

  insertedRoutes.forEach((route) => {
    const busCount = Math.floor(Math.random() * 4) + 3; // 3–6 buses
    for (let i = 0; i < busCount; i++) {
      const busNumber = `BUS${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
      const operator = operators[Math.floor(Math.random() * operators.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const capacity = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
      const seatsAvailable = Math.floor(capacity * (Math.random() * (0.9 - 0.5) + 0.5));
      const price = Math.floor((route.distance / 1000) * (Math.random() * (2000 - 800) + 800));
      const liveTracking = Math.random() > 0.5;
      const primo = Math.random() > 0.7;
      const departureTimeStr = times[Math.floor(Math.random() * times.length)];
      const departureTime = createTimeOnReferenceDate(departureTimeStr);
      const arrivalTime = calculateArrivalTime(departureTime, route.duration);

      buses.push({
        busNumber,
        operator,
        type,
        capacity,
        seatsAvailable,
        price,
        liveTracking,
        primo,
        routeId: route._id,
        departureTime,
        arrivalTime,
        isDeleted: false,
        createdAt: new Date(),
      });
    }
  });
  return buses;
};

async function seedRoutesAndBuses() {
  try {
    // Validate MONGO_URI
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB for seeding routes and buses");

    // Get existing routes
    const existingRoutes = await Route.find({}, { source: 1, destination: 1 });
    const existingRouteKeys = new Set(
      existingRoutes.map((route) => `${route.source}-${route.destination}`)
    );
    logger.info(`Found ${existingRoutes.length} existing routes`);

    // Generate routes and filter out duplicates
    const allRoutes = generateRoutes();
    const newRoutes = allRoutes.filter(
      (route) => !existingRouteKeys.has(`${route.source}-${route.destination}`)
    );
    logger.info(`Generated ${allRoutes.length} routes, ${newRoutes.length} are new`);

    // Seed Routes
    let insertedRoutes = [];
    if (newRoutes.length > 0) {
      try {
        insertedRoutes = await Route.insertMany(newRoutes, { ordered: false });
        logger.info(`Seeded ${insertedRoutes.length} Routes`);
      } catch (routeError) {
        logger.error("Failed to seed some Routes, continuing with successful ones", { error: routeError });
        // Extract successfully inserted routes from the error response
        if (routeError.insertedDocs) {
          insertedRoutes = routeError.insertedDocs;
          logger.info(`Partially seeded ${insertedRoutes.length} Routes`);
        }
      }
    } else {
      logger.info("No new routes to seed");
    }

    // Seed Buses for newly inserted routes
    let insertedBuses = [];
    if (insertedRoutes.length > 0) {
      const buses = generateBuses(insertedRoutes);
      try {
        insertedBuses = await Bus.insertMany(buses, { ordered: false });
        logger.info(`Seeded ${insertedBuses.length} Buses`);
      } catch (busError) {
        logger.error("Failed to seed Buses", { error: busError });
        throw busError;
      }
    } else {
      logger.info("No buses seeded due to no new routes");
    }

    logger.info("Seeding routes and buses completed successfully");
  } catch (error) {
    logger.error("Seeding failed", { error });
    throw error;
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
}

seedRoutesAndBuses().catch((err) => {
  console.error("Seeding process failed:", err);
  process.exit(1);
});