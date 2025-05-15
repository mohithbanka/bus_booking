const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bus_booking", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// module.exports = connectDB;

// const User = require("./models/Users");

// const insertUsers = async () => {
//   try {
//     await User.insertMany([
//       {
//         name: "Alice Johnson",
//         email: "alice@example.com",
//         password: "hashed_password1",
//         phone_number: "9876543210",
//         role: "user",
//       },
//       {
//         name: "Bob Smith",
//         email: "bob@example.com",
//         password: "hashed_password2",
//         phone_number: "1234567890",
//         role: "admin",
//       },
//     ]);
//     console.log("Users inserted successfully!");
//   } catch (error) {
//     console.error("Error inserting users:", error.message);
//   }
// };

// const Route = require("./models/Route");

// const insertRoutes = async () => {
//   try {
//     await Route.insertMany([
//       {
//         source: "City A",
//         destination: "City B",
//         distance: 200,
//         duration: "4h 30m",
//       },
//       {
//         source: "City B",
//         destination: "City C",
//         distance: 150,
//         duration: "3h",
//       },
//     ]);
//     console.log("Routes inserted successfully!");
//   } catch (error) {
//     console.error("Error inserting routes:", error.message);
//   }
// };

const Bus = require("./models/Bus");

const insertBuses = async () => {
  try {
    await Bus.insertMany([
      {
        bus_number: "MH12AB1234",
        operator: "City Travels",
        capacity: 40,
        route_id: new mongoose.Types.ObjectId("67644c1e9fe65b32dfaa8e25"), // Replace with actual Route ID
        departure_time: new Date("2024-12-20T08:00:00"),
        arrival_time: new Date("2024-12-20T12:30:00"),
      },
      {
        bus_number: "MH12CD5678",
        operator: "Metro Bus",
        capacity: 50,
        route_id: new mongoose.Types.ObjectId("67644c1e9fe65b32dfaa8e26"), // Replace with actual Route ID
        departure_time: new Date("2024-12-21T10:00:00"),
        arrival_time: new Date("2024-12-21T13:00:00"),
      },
    ]);
    // console.log("Buses inserted successfully!");
  } catch (error) {
    console.error("Error inserting buses:", error.message);
  }
};

// // module.exports = { insertUsers, insertRoutes, insertBuses };

// insertUsers();
// insertRoutes();
// insertBuses();

module.exports = connectDB;
