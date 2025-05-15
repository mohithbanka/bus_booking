import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import AvailableBuses from "../Components/AvailableBuses/AvailableBuses";
import axios from "axios";
import debounce from "lodash/debounce";

const REACT_APP_BACKEND_URL = "http://localhost:5000";

const SearchPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const fromCity = queryParams.get("fromCity") || "";
  const toCity = queryParams.get("toCity") || "";
  const travelDate = queryParams.get("travelDate") || "";
  const busTypes = queryParams.get("busTypes")?.split(",").filter(Boolean) || [];
  const liveTracking = queryParams.get("liveTracking") === "true";
  const primo = queryParams.get("primo") === "true";
  const seatsAvailable = queryParams.get("seatsAvailable") || "1";

  const [filters, setFilters] = useState({
    liveTracking,
    primoBus: primo,
    departureTime: {
      before6am: false,
      morning: false,
      afternoon: false,
      after6pm: false,
    },
    busTypes: {
      seater: busTypes.includes("Seater"),
      sleeper: busTypes.includes("Sleeper"),
      ac: busTypes.includes("AC"),
      nonAc: busTypes.includes("NonAC"),
    },
    seatAvailability: {
      singleSeats: parseInt(seatsAvailable) >= 1,
    },
    arrivalTime: {
      before6am: false,
      morning: false,
      afternoon: false,
      after6pm: false,
    },
  });

  const fetchBuses = useCallback(async () => {
    if (!fromCity || !toCity || !travelDate) {
      setError("Please provide From City, To City, and Travel Date.");
      setBuses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setBuses([]); // Clear previous results

    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/buses`, {
        params: {
          fromCity,
          toCity,
          travelDate,
          busTypes: Object.keys(filters.busTypes)
            .filter((key) => filters.busTypes[key])
            .map((key) =>
              key === "seater" ? "Seater" :
              key === "sleeper" ? "Sleeper" :
              key === "ac" ? "AC" : "NonAC"
            )
            .join(","),
          liveTracking: filters.liveTracking,
          primo: filters.primoBus,
          seatsAvailable: filters.seatAvailability.singleSeats ? "1" : "",
        },
        timeout: 5000,
      });

      const fetchedBuses = Array.isArray(response.data)
        ? response.data
        : response.data.buses || [];
      setBuses(fetchedBuses);
      if (response.data.error) {
        setError(response.data.error);
      } else if (fetchedBuses.length === 0) {
        setError("No buses found for the selected criteria.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message === "timeout of 5000ms exceeded"
          ? "Request timed out. Please try again."
          : "Failed to fetch bus data. Please try again.";
      setError(errorMessage);
      setBuses([]);
    } finally {
      setIsLoading(false);
    }
  }, [fromCity, toCity, travelDate, filters]);

  // Debounce filter changes to prevent rapid API calls
  const debouncedHandleFilterChange = useCallback(
    debounce((newFilters) => {
      setFilters(newFilters);

      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.set("liveTracking", newFilters.liveTracking);
      newQueryParams.set("primo", newFilters.primoBus);
      newQueryParams.set(
        "busTypes",
        Object.keys(newFilters.busTypes)
          .filter((key) => newFilters.busTypes[key])
          .map((key) =>
            key === "seater" ? "Seater" :
            key === "sleeper" ? "Sleeper" :
            key === "ac" ? "AC" : "NonAC"
          )
          .join(",")
      );
      newQueryParams.set(
        "seatsAvailable",
        newFilters.seatAvailability.singleSeats ? "1" : ""
      );

      navigate(`${location.pathname}?${newQueryParams.toString()}`, {
        replace: true,
      });
    }, 300),
    [navigate, location.pathname, location.search]
  );

  useEffect(() => {
    fetchBuses();
    return () => {
      debouncedHandleFilterChange.cancel(); // Cleanup debounce on unmount
    };
  }, [fetchBuses, debouncedHandleFilterChange]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <i className={`fa-solid ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <Sidebar filters={filters} onFilterChange={debouncedHandleFilterChange} buses={buses} />
      </aside>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {isLoading && (
          <div className="text-center text-gray-600 p-4">
            Loading buses...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        {!isLoading && buses.length === 0 && !error && (
          <div className="text-center text-gray-600 p-4">
            No buses found for the selected criteria.
          </div>
        )}
        <AvailableBuses buses={buses} filters={filters} />
      </div>
    </div>
  );
};

export default SearchPage;