const mongoose = require("mongoose");
const User = require("../models/User");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const logger = require("../utils/logger");
require("dotenv").config();

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB for migration");

    // Migrate Bus documents
    await Bus.updateMany(
      { type: { $exists: false } },
      {
        $set: {
          type: "AC", // Default value
          seatsAvailable: "$capacity",
          price: 500, // Default price in INR
          liveTracking: false,
          primo: false,
          busNumber: {
            $cond: {
              if: "$bus_number",
              then: "$bus_number",
              else: mongoose.Types.ObjectId().toString(),
            },
          },
          routeId: "$route_id",
          departureTime: "$departure_time",
          arrivalTime: "$arrival_time",
        },
        $unset: {
          bus_number: 1,
          route_id: 1,
          departure_time: 1,
          arrival_time: 1,
        },
      }
    );
    logger.info("Migrated Bus documents");

    // Migrate User.bookings to Booking collection
    const users = await User.find({ bookings: { $exists: true, $ne: [] } });
    for (const user of users) {
      for (const booking of user.bookings) {
        await Booking.create({
          userId: user._id,
          busId: booking.busId,
          routeId: (await Bus.findById(booking.busId))?.routeId, // Fetch routeId from Bus
          seatNumbers: [`S${booking.seats}`], // Convert number to string (e.g., "S1")
          bookingDate: new Date(),
          journeyDate: booking.date,
          status: "confirmed",
          totalAmount: 500, // Default; adjust based on Bus.price
        });
      }
      await User.updateOne({ _id: user._id }, { $unset: { bookings: 1 } });
    }
    logger.info("Migrated User.bookings to Booking collection");

    // Ensure indexes are created
    await User.createIndexes();
    await Route.createIndexes();
    await Bus.createIndexes();
    await Booking.createIndexes();
    logger.info("Indexes created");

    logger.info("Migration completed successfully");
  } catch (error) {
    logger.error("Migration failed", { error });
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
}

migrate();
