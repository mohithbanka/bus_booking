import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BusCard from "../BusCard/BusCard";

const AvailableBuses = ({ buses, filters }) => {
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [sortBy, setSortBy] = useState("price");
  const navigate = useNavigate();
  const fromCity = new URLSearchParams(window.location.search).get("fromCity") || "Unknown";
  const toCity = new URLSearchParams(window.location.search).get("toCity") || "Unknown";
  const travelDate = new URLSearchParams(window.location.search).get("travelDate");

  const parseTime = (timeString) => {
    if (!timeString) return null;
    if (timeString.includes("T")) {
      return parseInt(timeString.split("T")[1].split(":")[0], 10);
    }
    return null;
  };

  useEffect(() => {
    const clientFilteredBuses = buses.filter((bus) => {
      // Departure Time filter
      if (
        filters.departureTime.before6am ||
        filters.departureTime.morning ||
        filters.departureTime.afternoon ||
        filters.departureTime.after6pm
      ) {
        const departureHour = parseTime(bus.departureTime);
        if (
          !departureHour ||
          (filters.departureTime.before6am && departureHour >= 6) ||
          (filters.departureTime.morning &&
            (departureHour < 6 || departureHour >= 12)) ||
          (filters.departureTime.afternoon &&
            (departureHour < 12 || departureHour >= 18)) ||
          (filters.departureTime.after6pm && departureHour < 18)
        ) {
          return false;
        }
      }

      // Bus Types filter
      if (
        filters.busTypes.seater ||
        filters.busTypes.sleeper ||
        filters.busTypes.ac ||
        filters.busTypes.nonAc
      ) {
        const busType = bus.type?.toLowerCase();
        const isSeater = busType.includes("seater");
        const isSleeper = busType.includes("sleeper");
        const isAc = busType.includes("ac");
        const isNonAc = busType.includes("nonac") || !isAc;
        if (
          (filters.busTypes.seater && !isSeater) ||
          (filters.busTypes.sleeper && !isSleeper) ||
          (filters.busTypes.ac && !isAc) ||
          (filters.busTypes.nonAc && !isNonAc)
        ) {
          return false;
        }
      }

      // Seat Availability filter
      if (filters.seatAvailability.singleSeats && bus.seatsAvailable < 1) {
        return false;
      }

      // Arrival Time filter (calculated using routeId.duration)
      if (
        filters.arrivalTime.before6am ||
        filters.arrivalTime.morning ||
        filters.arrivalTime.afternoon ||
        filters.arrivalTime.after6pm
      ) {
        const departure = new Date(bus.departureTime);
        const arrival = new Date(departure.getTime() + bus.routeId.duration * 60 * 1000);
        const arrivalHour = arrival.getUTCHours();
        if (
          !arrivalHour ||
          (filters.arrivalTime.before6am && arrivalHour >= 6) ||
          (filters.arrivalTime.morning &&
            (arrivalHour < 6 || arrivalHour >= 12)) ||
          (filters.arrivalTime.afternoon &&
            (arrivalHour < 12 || arrivalHour >= 18)) ||
          (filters.arrivalTime.after6pm && arrivalHour < 18)
        ) {
          return false;
        }
      }

      return true;
    });

    const sortedBuses = [...clientFilteredBuses].sort((a, b) => {
      const aTime = new Date(a.departureTime);
      const bTime = new Date(b.departureTime);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "departureTime") return aTime - bTime;
      return 0;
    });

    setFilteredBuses(sortedBuses);
  }, [buses, filters, sortBy]);

  const handleBookNow = (bus) => {
    navigate(
      `/book?busId=${bus._id}&fromCity=${fromCity}&toCity=${toCity}&travelDate=${travelDate}`
    );
    if (typeof window.gtag === "function") {
      window.gtag("event", "book_now_click", {
        event_category: "Booking",
        busId: bus._id,
        busNumber: bus.busNumber,
      });
    }
  };

  return (
    <div className="available-buses container mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4 sm:mb-0 animate-fade-in">
          Buses from {fromCity} to {toCity}
        </h2>
        {buses.length > 0 && (
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
            >
              <option value="price">Price (Low to High)</option>
              <option value="departureTime">Departure Time</option>
            </select>
          </div>
        )}
      </div>

      {buses.length > 0 ? (
        <div
          className="flex flex-col gap-6"
          role="list"
          aria-label="Available buses"
        >
          {filteredBuses.map((bus) => (
            <div
              key={bus._id}
              className="w-full transform transition-all duration-300 hover:scale-[1.01]"
            >
              <BusCard bus={bus} onBookNow={() => handleBookNow(bus)} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center text-gray-600 bg-white p-6 rounded-xl shadow-lg"
          role="status"
          aria-live="polite"
        >
          No buses available for the selected route and date.
        </div>
      )}
    </div>
  );
};

export default AvailableBuses;