import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusCard from "../BusCard/BusCard";
import axios from "axios";

// Define API_BASE_URL with environment-aware fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://bus-booking-cw48.onrender.com"
    : "http://localhost:5000");
console.log("API_BASE_URL:", API_BASE_URL);

const AvailableBuses = () => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const fromCity = queryParams.get("fromCity");
  const toCity = queryParams.get("toCity");

  // Validate and set travelDate
  const travelDateRaw = queryParams.get("travelDate");
  let travelDate = travelDateRaw;

  const currentDate = new Date();
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  const defaultTravelDate = tomorrow.toISOString().split("T")[0]; // e.g., "2025-05-14"

  if (!travelDate) {
    travelDate = defaultTravelDate;
    queryParams.set("travelDate", travelDate);
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
  } else {
    const travelDateObj = new Date(travelDate);
    const travelDateOnly = new Date(
      Date.UTC(travelDateObj.getUTCFullYear(), travelDateObj.getUTCMonth(), travelDateObj.getUTCDate())
    );
    const currentDateOnly = new Date(
      Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
    );
    if (isNaN(travelDateObj.getTime()) || travelDateOnly < currentDateOnly) {
      setError("Travel date cannot be in the past or invalid. Defaulting to tomorrow.");
      travelDate = defaultTravelDate;
      queryParams.set("travelDate", travelDate);
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
    }
  }

  const busTypes = queryParams.get("busTypes")?.split(",") || [];
  const liveTracking = queryParams.get("liveTracking") === "true";
  const primo = queryParams.get("primo") === "true";
  const seatsAvailable = queryParams.get("seatsAvailable") || "1";

  const memoizedBusTypes = useMemo(() => busTypes.join(","), [busTypes]);

  const fetchBuses = useCallback(async () => {
    if (!fromCity || !toCity || !travelDate) {
      setError("Please provide From City, To City, and Travel Date.");
      setBuses([]);
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Fetching buses with params:", {
      fromCity,
      toCity,
      travelDate,
      busTypes,
      liveTracking,
      primo,
      seatsAvailable,
    });

    try {
      const response = await axios.get(`${API_BASE_URL}/buses`, {
        params: {
          fromCity,
          toCity,
          travelDate,
          busTypes: memoizedBusTypes,
          liveTracking,
          primo,
          seatsAvailable,
        },
        timeout: 10000,
      });
      console.log("Response:", response.data);
      const fetchedBuses = response.data.buses || [];
      setBuses(fetchedBuses);
      setFilteredBuses(fetchedBuses);
      setLoading(false);

      if (typeof window.gtag === "function") {
        window.gtag("event", "bus_search", {
          event_category: "Search",
          fromCity,
          toCity,
          travelDate,
          busCount: fetchedBuses.length,
        });
      } else {
        console.warn("Google Analytics gtag is not available");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      const message =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. The server might be down or slow."
          : "Failed to fetch buses. Please try again.");
      setError(message);
      setBuses([]);
      setFilteredBuses([]);
      setLoading(false);
    }
  }, [
    fromCity,
    toCity,
    travelDate,
    memoizedBusTypes,
    liveTracking,
    primo,
    seatsAvailable,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  useEffect(() => {
    const sortedBuses = [...buses].sort((a, b) => {
      const aTime = new Date(a.departureTime);
      const bTime = new Date(b.departureTime);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "departureTime") return aTime - bTime;
      return 0;
    });
    setFilteredBuses(sortedBuses);
  }, [buses, sortBy]);

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
    } else {
      console.warn("Google Analytics gtag is not available");
    }
  };

  const handleRetry = () => {
    fetchBuses();
  };

  return (
    <div className="available-buses container mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4 sm:mb-0 animate-fade-in">
          Buses from {fromCity || "Unknown"} to {toCity || "Unknown"}
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

      {loading && (
        <div
          className="text-center text-gray-600 bg-white p-6 rounded-xl shadow-lg"
          role="status"
          aria-live="polite"
        >
          <svg
            className="animate-spin h-10 w-10 mx-auto text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            ></path>
          </svg>
          <p className="mt-3 text-lg">Searching for buses...</p>
        </div>
      )}

      {error && (
        <div
          className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-lg mb-6"
          role="alert"
          aria-live="assertive"
        >
          <p className="mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <i className="fa-solid fa-rotate-right"></i>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filteredBuses.length > 0 ? (
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
        !loading &&
        !error && (
          <div
            className="text-center text-gray-600 bg-white p-6 rounded-xl shadow-lg"
            role="status"
            aria-live="polite"
          >
            No buses available for the selected route and date.
          </div>
        )
      )}
    </div>
  );
};

export default AvailableBuses;