import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusCard from "../BusCard/BusCard";
import axios from "axios";

const AvailableBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const fromCity = queryParams.get("fromCity");
  const toCity = queryParams.get("toCity");
  const travelDate = queryParams.get("travelDate");
  const busTypes = queryParams.get("busTypes")?.split(",") || [];
  const liveTracking = queryParams.get("liveTracking") === "true";
  const primo = queryParams.get("primo") === "true";
  const seatsAvailable = queryParams.get("seatsAvailable") || "1";

  const memoizedBusTypes = useMemo(() => busTypes.join(","), [busTypes]);

  useEffect(() => {
    console.log("useEffect triggered with dependencies:", {
      fromCity,
      toCity,
      travelDate,
      busTypes,
      liveTracking,
      primo,
      seatsAvailable,
    });
    if (fromCity && toCity && travelDate) {
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
      axios
        .get("http://localhost:5000/buses", {
          params: {
            fromCity,
            toCity,
            travelDate,
            busTypes: memoizedBusTypes,
            liveTracking,
            primo,
            seatsAvailable,
          },
          timeout: 10000, // 10-second timeout
        })
        .then((response) => {
          // console.log("Response:", response.data);
          setBuses(response.data.buses || []);
          setLoading(false);
          if (typeof window.gtag === "function") {
            window.gtag("event", "bus_search", {
              event_category: "Search",
              fromCity,
              toCity,
              travelDate,
              busCount: response.data.buses.length,
            });
          } else {
            console.warn("Google Analytics gtag is not available");
          }
        })
        .catch((err) => {
          console.error("Error:", err.response?.data || err.message);
          const message =
            err.response?.data?.message ||
            err.code === "ECONNABORTED"
              ? "Request timed out. Please check the server and try again."
              : "Failed to fetch buses. Please try again.";
          setError(message);
          setBuses([]);
          setLoading(false);
        });
    } else {
      setError("Please provide From City, To City, and Travel Date.");
      setBuses([]);
    }
  }, [
    fromCity,
    toCity,
    travelDate,
    memoizedBusTypes,
    liveTracking,
    primo,
    seatsAvailable,
  ]);
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

  return (
    <div className="available-buses container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
        Available Buses from {fromCity || "Unknown"} to {toCity || "Unknown"}
      </h2>
      {loading && (
        <div
          className="text-center text-gray-600"
          role="status"
          aria-live="polite"
        >
          <svg
            className="animate-spin h-8 w-8 mx-auto text-primary"
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
          <p className="mt-2">Loading buses...</p>
        </div>
      )}
      {error && (
        <div
          className="text-center text-red-500 bg-red-100 p-4 rounded-md mb-6"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {!loading && !error && buses.length > 0 ? (
        <div className="space-y-6" role="list" aria-label="Available buses">
          {buses.map((bus) => (
            <BusCard
              key={bus._id}
              bus={bus}
              onBookNow={() => handleBookNow(bus)}
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div
            className="text-center text-gray-600 bg-gray-100 p-4 rounded-md"
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