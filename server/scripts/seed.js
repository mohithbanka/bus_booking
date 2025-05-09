const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Route = require("../models/Route");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment"); // Optional
const logger = require("../utils/logger");
require("dotenv").config();

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB for seeding");

    // Clear existing data (optional; comment out to append)
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
    const insertedUsers = await User.insertMany(users);
    logger.info("Seeded Users");

    // Seed Routes
    const routes = [
      { source: "DELHI", destination: "MUMBAI", distance: 1400, duration: 1440 }, // 24h
      { source: "BANGALORE", destination: "CHENNAI", distance: 350, duration: 360 }, // 6h
      { source: "KOLKATA", destination: "DELHI", distance: 1500, duration: 1560 }, // 26h
      { source: "MUMBAI", destination: "BANGALORE", distance: 1000, duration: 1080 }, // 18h
      { source: "CHENNAI", destination: "HYDERABAD", distance: 700, duration: 720 }, // 12h
      { source: "DELHI", destination: "JAIPUR", distance: 300, duration: 300 }, // 5h
    ];
    const insertedRoutes = await Route.insertMany(routes);
    logger.info("Seeded Routes");

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
        routeId: insertedRoutes[0]._id, // Delhi to Mumbai
        departureTime: new Date("2025-05-10T08:00:00Z"),
        arrivalTime: new Date("2025-05-11T08:00:00Z"),
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
        routeId: insertedRoutes[0]._id, // Delhi to Mumbai
        departureTime: new Date("2025-05-10T10:00:00Z"),
        arrivalTime: new Date("2025-05-11T10:00:00Z"),
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
        routeId: insertedRoutes[1]._id, // Bangalore to Chennai
        departureTime: new Date("2025-05-10T09:00:00Z"),
        arrivalTime: new Date("2025-05-10T15:00:00Z"),
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
        routeId: insertedRoutes[2]._id, // Kolkata to Delhi
        departureTime: new Date("2025-05-10T07:00:00Z"),
        arrivalTime: new Date("2025-05-11T09:00:00Z"),
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
        routeId: insertedRoutes[3]._id, // Mumbai to Bangalore
        departureTime: new Date("2025-05-10T12:00:00Z"),
        arrivalTime: new Date("2025-05-11T06:00:00Z"),
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
        routeId: insertedRoutes[4]._id, // Chennai to Hyderabad
        departureTime: new Date("2025-05-10T08:00:00Z"),
        arrivalTime: new Date("2025-05-10T20:00:00Z"),
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
        routeId: insertedRoutes[5]._id, // Delhi to Jaipur
        departureTime: new Date("2025-05-10T06:00:00Z"),
        arrivalTime: new Date("2025-05-10T11:00:00Z"),
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
        routeId: insertedRoutes[0]._id, // Delhi to Mumbai
        departureTime: new Date("2025-05-10T14:00:00Z"),
        arrivalTime: new Date("2025-05-11T14:00:00Z"),
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
        routeId: insertedRoutes[1]._id, // Bangalore to Chennai
        departureTime: new Date("2025-05-10T11:00:00Z"),
        arrivalTime: new Date("2025-05-10T17:00:00Z"),
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
        routeId: insertedRoutes[2]._id, // Kolkata to Delhi
        departureTime: new Date("2025-05-10T09:00:00Z"),
        arrivalTime: new Date("2025-05-11T11:00:00Z"),
      },
    ];
    const insertedBuses = await Bus.insertMany(buses);
    logger.info("Seeded Buses");

    // Seed Bookings
    const bookings = [
      {
        userId: insertedUsers[0]._id, // John Doe
        busId: insertedBuses[0]._id, // BUS001
        routeId: insertedRoutes[0]._id, // Delhi to Mumbai
        seatNumbers: ["A1", "A2"],
        bookingDate: new Date("2025-05-01T10:00:00Z"),
        journeyDate: new Date("2025-05-10T08:00:00Z"),
        status: "confirmed",
        totalAmount: 3000, // 2 seats * 1500
      },
      {
        userId: insertedUsers[1]._id, // Jane Smith
        busId: insertedBuses[1]._id, // BUS002
        routeId: insertedRoutes[0]._id,
        seatNumbers: ["B1"],
        bookingDate: new Date("2025-05-02T12:00:00Z"),
        journeyDate: new Date("2025-05-10T10:00:00Z"),
        status: "confirmed",
        totalAmount: 1800,
      },
      {
        userId: insertedUsers[2]._id, // Alice Brown
        busId: insertedBuses[2]._id, // BUS003
        routeId: insertedRoutes[1]._id, // Bangalore to Chennai
        seatNumbers: ["C1", "C2"],
        bookingDate: new Date("2025-05-03T09:00:00Z"),
        journeyDate: new Date("2025-05-10T09:00:00Z"),
        status: "pending",
        totalAmount: 1600,
      },
      {
        userId: insertedUsers[3]._id, // Bob Wilson
        busId: insertedBuses[3]._id, // BUS004
        routeId: insertedRoutes[2]._id, // Kolkata to Delhi
        seatNumbers: ["D1"],
        bookingDate: new Date("2025-05-04T14:00:00Z"),
        journeyDate: new Date("2025-05-10T07:00:00Z"),
        status: "confirmed",
        totalAmount: 1200,
      },
      {
        userId: insertedUsers[4]._id, // Emma Davis
        busId: insertedBuses[4]._id, // BUS005
        routeId: insertedRoutes[3]._id, // Mumbai to Bangalore
        seatNumbers: ["E1", "E2"],
        bookingDate: new Date("2025-05-05T11:00:00Z"),
        journeyDate: new Date("2025-05-10T12:00:00Z"),
        status: "confirmed",
        totalAmount: 3200,
      },
      {
        userId: insertedUsers[0]._id, // John Doe
        busId: insertedBuses[5]._id, // BUS006
        routeId: insertedRoutes[4]._id, // Chennai to Hyderabad
        seatNumbers: ["F1"],
        bookingDate: new Date("2025-05-06T08:00:00Z"),
        journeyDate: new Date("2025-05-10T08:00:00Z"),
        status: "cancelled",
        totalAmount: 1400,
      },
      {
        userId: insertedUsers[1]._id, // Jane Smith
        busId: insertedBuses[6]._id, // BUS007
        routeId: insertedRoutes[5]._id, // Delhi to Jaipur
        seatNumbers: ["G1", "G2"],
        bookingDate: new Date("2025-05-07T15:00:00Z"),
        journeyDate: new Date("2025-05-10T06:00:00Z"),
        status: "confirmed",
        totalAmount: 1200,
      },
      {
        userId: insertedUsers[2]._id, // Alice Brown
        busId: insertedBuses[7]._id, // BUS008
        routeId: insertedRoutes[0]._id, // Delhi to Mumbai
        seatNumbers: ["H1"],
        bookingDate: new Date("2025-05-08T10:00:00Z"),
        journeyDate: new Date("2025-05-10T14:00:00Z"),
        status: "confirmed",
        totalAmount: 1700,
      },
    ];
    const insertedBookings = await Booking.insertMany(bookings);
    logger.info("Seeded Bookings");

    // Seed Payments (optional; comment out if Payment model is not used)
    const payments = insertedBookings.map((booking, index) => ({
      userId: booking.userId,
      bookingId: booking._id,
      amount: booking.totalAmount,
      status: booking.status === "confirmed" ? "completed" : booking.status === "pending" ? "pending" : "failed",
      paymentMethod: ["card", "upi", "wallet"][index % 3],
      transactionId: `TXN_${Date.now()}_${index}`,
    }));
    await Payment.insertMany(payments);
    logger.info("Seeded Payments");

    // Update Bookings with Payment IDs
    for (let i = 0; i < insertedBookings.length; i++) {
      await Booking.findByIdAndUpdate(insertedBookings[i]._id, {
        paymentId: insertedPayments[i]._id,
      });
    }
    logger.info("Updated Bookings with Payment IDs");

    logger.info("Seeding completed successfully");
  } catch (error) {
    logger.error("Seeding failed", { error });
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
}

seed();