const mongoose = require("mongoose");
const Bus = require("../models/Bus");
const logger = require("../utils/logger");
require("dotenv").config();

async function findRouteWithMostBuses() {
  try {
    // Validate MONGO_URI
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB for querying route with most buses");

    // Perform aggregation
    const result = await Bus.aggregate([
      // Group buses by routeId and count
      {
        $group: {
          _id: "$routeId",
          busCount: { $sum: 1 }
        }
      },
      // Sort by busCount in descending order
      {
        $sort: { busCount: -1 }
      },
      // Limit to the top route
      {
        $limit: 1
      },
      // Lookup route details
      {
        $lookup: {
          from: "routes",
          localField: "_id",
          foreignField: "_id",
          as: "route"
        }
      },
      // Unwind the route array
      {
        $unwind: "$route"
      },
      // Project the desired fields
      {
        $project: {
          source: "$route.source",
          destination: "$route.destination",
          busCount: 1
        }
      }
    ]);

    // Log the result
    if (result.length > 0) {
      const { source, destination, busCount } = result[0];
      logger.info(`Route with most buses: ${source} to ${destination} with ${busCount} buses`);
      console.log(`Route with most buses: ${source} to ${destination} with ${busCount} buses`);
    } else {
      logger.info("No buses found in the database");
      console.log("No buses found in the database");
    }

  } catch (error) {
    logger.error("Failed to find route with most buses", { error });
    console.error("Error:", error.message);
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
}

findRouteWithMostBuses().catch((err) => {
  console.error("Process failed:", err);
  process.exit(1);
});