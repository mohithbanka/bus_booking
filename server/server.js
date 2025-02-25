const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Bus = require("./models/Bus");
const Route = require("./models/Route");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello from my server");
});

app.get("/buses", async (req, res) => {
  try {
    console.log("Received Query Params:", req.query); // Debug log

    let { fromCity, toCity } = req.query;
    if (!fromCity || !toCity) {
      return res.status(400).json({ message: "Both cities are required" });
    }

    fromCity = fromCity.trim().toLowerCase();
    toCity = toCity.trim().toLowerCase();

    const matchingRoutes = await Route.find({
      source: { $regex: new RegExp(`^${fromCity}$`, "i") },
      destination: { $regex: new RegExp(`^${toCity}$`, "i") },
    });

    if (matchingRoutes.length === 0) {
      return res
        .status(404)
        .json({ message: `No routes found from ${fromCity} to ${toCity}` });
    }

    const routeIds = matchingRoutes.map((route) => route._id);
    const buses = await Bus.find({ route_id: { $in: routeIds } });

    if (buses.length === 0) {
      return res
        .status(404)
        .json({ message: `No buses available from ${fromCity} to ${toCity}` });
    }

    console.log("Buses Found:", buses); // Debug log
    return res.status(200).json({ buses });
  } catch (error) {
    console.error("Error fetching buses:", error.message);
    return res.status(500).json({ error: "Failed to fetch buses" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
