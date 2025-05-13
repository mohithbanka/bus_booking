const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Route = require("../models/Route");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const logger = require("../utils/logger");
require("dotenv").config();

// Helper function to create a Date object for a specific time on a reference date (1970-01-01)
const createTimeOnReferenceDate = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date("1970-01-01T00:00:00Z");
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
};

// Helper function to calculate arrival time based on departure time and duration
const calculateArrivalTime = (departureTime, durationMinutes) => {
  const departureMs = departureTime.getTime();
  const durationMs = durationMinutes * 60 * 1000; // Convert minutes to milliseconds
  return new Date(departureMs + durationMs);
};

async function seed() {
  try {
    // Validate MONGO_URI
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB for seeding");

    // Clear existing data
    await User.deleteMany({});
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    logger.info("Cleared existing data");

    // Seed Users
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "1234567890",
        avatar: "https://example.com/john.jpg",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "0987654321",
      },
      {
        name: "Alice Brown",
        email: "alice@example.com",
        googleId: "google123",
        phone: "1122334455",
        avatar: "https://example.com/alice.jpg",
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "5566778899",
      },
      {
        name: "Emma Davis",
        email: "emma@example.com",
        googleId: "google456",
        phone: "6677889900",
      },
    ];
    let insertedUsers;
    try {
      insertedUsers = await User.insertMany(users);
      logger.info(`Seeded ${insertedUsers.length} Users`);
    } catch (userError) {
      logger.error("Failed to seed Users", { error: userError });
      throw userError;
    }

    // Seed Routes
    const routes = [
      { source: "DELHI", destination: "MUMBAI", distance: 1400, duration: 1440 },
      { source: "BANGALORE", destination: "CHENNAI", distance: 350, duration: 360 },
      { source: "KOLKATA", destination: "DELHI", distance: 1500, duration: 1560 },
      { source: "MUMBAI", destination: "BANGALORE", distance: 1000, duration: 1080 },
      { source: "CHENNAI", destination: "HYDERABAD", distance: 700, duration: 720 },
      { source: "DELHI", destination: "JAIPUR", distance: 300, duration: 300 },
    ];
    let insertedRoutes;
    try {
      insertedRoutes = await Route.insertMany(routes);
      logger.info(`Seeded ${insertedRoutes.length} Routes`);
    } catch (routeError) {
      logger.error("Failed to seed Routes", { error: routeError });
      throw routeError;
    }

    // Seed Buses
    const buses = [
      {
        busNumber: "BUS001",
        operator: "TravelCo",
        type: "AC",
        capacity: 40,
        seatsAvailable: 35,
        price: 1500,
        liveTracking: true,
        primo: false,
        routeId: insertedRoutes[0]._id,
        departureTime: createTimeOnReferenceDate("08:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("08:00:00"), insertedRoutes[0].duration),
      },
      {
        busNumber: "BUS002",
        operator: "FastTrack",
        type: "Sleeper",
        capacity: 36,
        seatsAvailable: 30,
        price: 1800,
        liveTracking: false,
        primo: true,
        routeId: insertedRoutes[0]._id,
        departureTime: createTimeOnReferenceDate("14:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("14:00:00"), insertedRoutes[0].duration),
      },
      {
        busNumber: "BUS008",
        operator: "LuxuryLiner",
        type: "AC",
        capacity: 40,
        seatsAvailable: 36,
        price: 1700,
        liveTracking: true,
        primo: true,
        routeId: insertedRoutes[0]._id,
        departureTime: createTimeOnReferenceDate("20:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("20:00:00"), insertedRoutes[0].duration),
      },
      {
        busNumber: "BUS003",
        operator: "CityRide",
        type: "NonAC",
        capacity: 50,
        seatsAvailable: 45,
        price: 800,
        liveTracking: false,
        primo: false,
        routeId: insertedRoutes[1]._id,
        departureTime: createTimeOnReferenceDate("09:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("09:00:00"), insertedRoutes[1].duration),
      },
      {
        busNumber: "BUS009",
        operator: "EcoTravel",
        type: "Seater",
        capacity: 42,
        seatsAvailable: 38,
        price: 900,
        liveTracking: false,
        primo: false,
        routeId: insertedRoutes[1]._id,
        departureTime: createTimeOnReferenceDate("15:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("15:00:00"), insertedRoutes[1].duration),
      },
      {
        busNumber: "BUS004",
        operator: "StarTravel",
        type: "Seater",
        capacity: 45,
        seatsAvailable: 40,
        price: 1200,
        liveTracking: true,
        primo: false,
        routeId: insertedRoutes[2]._id,
        departureTime: createTimeOnReferenceDate("07:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("07:00:00"), insertedRoutes[2].duration),
      },
      {
        busNumber: "BUS010",
        operator: "SkyBus",
        type: "Sleeper",
        capacity: 36,
        seatsAvailable: 32,
        price: 2000,
        liveTracking: true,
        primo: true,
        routeId: insertedRoutes[2]._id,
        departureTime: createTimeOnReferenceDate("09:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("09:00:00"), insertedRoutes[2].duration),
      },
      {
        busNumber: "BUS005",
        operator: "ComfortBus",
        type: "AC",
        capacity: 38,
        seatsAvailable: 33,
        price: 1600,
        liveTracking: false,
        primo: true,
        routeId: insertedRoutes[3]._id,
        departureTime: createTimeOnReferenceDate("12:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("12:00:00"), insertedRoutes[3].duration),
      },
      {
        busNumber: "BUS006",
        operator: "ExpressLine",
        type: "Sleeper",
        capacity: 34,
        seatsAvailable: 30,
        price: 1400,
        liveTracking: true,
        primo: false,
        routeId: insertedRoutes[4]._id,
        departureTime: createTimeOnReferenceDate("08:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("08:00:00"), insertedRoutes[4].duration),
      },
      {
        busNumber: "BUS007",
        operator: "QuickRide",
        type: "NonAC",
        capacity: 48,
        seatsAvailable: 44,
        price: 600,
        liveTracking: false,
        primo: false,
        routeId: insertedRoutes[5]._id,
        departureTime: createTimeOnReferenceDate("06:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("06:00:00"), insertedRoutes[5].duration),
      },
      {
        busNumber: "BUS011",
        operator: "SwiftRide",
        type: "AC",
        capacity: 40,
        seatsAvailable: 38,
        price: 700,
        liveTracking: true,
        primo: false,
        routeId: insertedRoutes[5]._id,
        departureTime: createTimeOnReferenceDate("12:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("12:00:00"), insertedRoutes[5].duration),
      },
      {
        busNumber: "BUS012",
        operator: "EasyGo",
        type: "Seater",
        capacity: 45,
        seatsAvailable: 42,
        price: 650,
        liveTracking: false,
        primo: false,
        routeId: insertedRoutes[5]._id,
        departureTime: createTimeOnReferenceDate("18:00:00"),
        arrivalTime: calculateArrivalTime(createTimeOnReferenceDate("18:00:00"), insertedRoutes[5].duration),
      },
    ];
    let insertedBuses;
    try {
      insertedBuses = await Bus.insertMany(buses);
      logger.info(`Seeded ${insertedBuses.length} Buses`);
    } catch (busError) {
      logger.error("Failed to seed Buses", { error: busError });
      throw busError;
    }

    // Seed Bookings
    const bookings = [
      {
        userId: insertedUsers[0]._id,
        busId: insertedBuses[0]._id,
        routeId: insertedRoutes[0]._id,
        seatNumbers: ["A1", "A2"],
        bookingDate: new Date("2025-05-01T10:00:00Z"),
        journeyDate: new Date("2025-05-13T08:00:00Z"),
        status: "confirmed",
        totalAmount: 3000,
      },
      {
        userId: insertedUsers[1]._id,
        busId: insertedBuses[1]._id,
        routeId: insertedRoutes[0]._id,
        seatNumbers: ["B1"],
        bookingDate: new Date("2025-05-02T12:00:00Z"),
        journeyDate: new Date("2025-05-13T14:00:00Z"),
        status: "confirmed",
        totalAmount: 1800,
      },
      {
        userId: insertedUsers[2]._id,
        busId: insertedBuses[3]._id,
        routeId: insertedRoutes[1]._id,
        seatNumbers: ["C1", "C2"],
        bookingDate: new Date("2025-05-03T09:00:00Z"),
        journeyDate: new Date("2025-05-13T09:00:00Z"),
        status: "pending",
        totalAmount: 1600,
      },
      {
        userId: insertedUsers[3]._id,
        busId: insertedBuses[5]._id,
        routeId: insertedRoutes[2]._id,
        seatNumbers: ["D1"],
        bookingDate: new Date("2025-05-04T14:00:00Z"),
        journeyDate: new Date("2025-05-13T07:00:00Z"),
        status: "confirmed",
        totalAmount: 1200,
      },
      {
        userId: insertedUsers[4]._id,
        busId: insertedBuses[7]._id,
        routeId: insertedRoutes[3]._id,
        seatNumbers: ["E1", "E2"],
        bookingDate: new Date("2025-05-05T11:00:00Z"),
        journeyDate: new Date("2025-05-13T12:00:00Z"),
        status: "confirmed",
        totalAmount: 3200,
      },
      {
        userId: insertedUsers[0]._id,
        busId: insertedBuses[8]._id,
        routeId: insertedRoutes[4]._id,
        seatNumbers: ["F1"],
        bookingDate: new Date("2025-05-06T08:00:00Z"),
        journeyDate: new Date("2025-05-13T08:00:00Z"),
        status: "cancelled",
        totalAmount: 1400,
      },
      {
        userId: insertedUsers[1]._id,
        busId: insertedBuses[9]._id,
        routeId: insertedRoutes[5]._id,
        seatNumbers: ["G1", "G2"],
        bookingDate: new Date("2025-05-07T15:00:00Z"),
        journeyDate: new Date("2025-05-13T06:00:00Z"),
        status: "confirmed",
        totalAmount: 1200,
      },
      {
        userId: insertedUsers[2]._id,
        busId: insertedBuses[2]._id,
        routeId: insertedRoutes[0]._id,
        seatNumbers: ["H1"],
        bookingDate: new Date("2025-05-08T10:00:00Z"),
        journeyDate: new Date("2025-05-13T20:00:00Z"),
        status: "confirmed",
        totalAmount: 1700,
      },
    ];
    let insertedBookings;
    try {
      insertedBookings = await Booking.insertMany(bookings);
      logger.info(`Seeded ${insertedBookings.length} Bookings`);
    } catch (bookingError) {
      logger.error("Failed to seed Bookings", { error: bookingError });
      throw bookingError;
    }

    // Seed Payments
    let insertedPayments;
    try {
      const payments = insertedBookings.map((booking, index) => ({
        userId: booking.userId,
        bookingId: booking._id,
        amount: booking.totalAmount,
        status:
          booking.status === "confirmed"
            ? "completed"
            : booking.status === "pending"
            ? "pending"
            : "failed",
        paymentMethod: ["card", "upi", "wallet"][index % 3],
        transactionId: `TXN_${Date.now()}_${index}`,
      }));
      insertedPayments = await Payment.insertMany(payments);
      logger.info(`Seeded ${insertedPayments.length} Payments`);
    } catch (paymentError) {
      logger.error("Failed to seed Payments", { error: paymentError });
      throw paymentError;
    }

    // Update Bookings with Payment IDs
    try {
      for (let i = 0; i < insertedBookings.length; i++) {
        await Booking.findByIdAndUpdate(insertedBookings[i]._id, {
          paymentId: insertedPayments[i]._id,
        });
      }
      logger.info("Updated Bookings with Payment IDs");
    } catch (updateError) {
      logger.error("Failed to update Bookings with Payment IDs", { error: updateError });
      throw updateError;
    }

    logger.info("Seeding completed successfully");
  } catch (error) {
    logger.error("Seeding failed", { error });
    throw error;
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
}

seed().catch((err) => {
  console.error("Seeding process failed:", err);
  process.exit(1);
});