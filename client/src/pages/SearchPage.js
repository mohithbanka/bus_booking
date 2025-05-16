import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import AvailableBuses from "../Components/AvailableBuses/AvailableBuses";
import axios from "axios";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import { motion } from "framer-motion";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_API_URL;
// console.log("REACT_APP_BACKEND_URL:", REACT_APP_BACKEND_URL);

const SearchPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const fromCity = queryParams.get("fromCity")?.toUpperCase() || "";
  const toCity = queryParams.get("toCity")?.toUpperCase() || "";
  const travelDate = queryParams.get("travelDate") || "";
  const busTypes =
    queryParams.get("busTypes")?.split(",").filter(Boolean) || [];
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

  const fetchBuses = useCallback(
    debounce(async () => {
      if (!fromCity || !toCity || !travelDate) {
        setError("Please provide From City, To City, and Travel Date.");
        toast.error("Please provide all required search fields.");
        setBuses([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setBuses([]);

      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/buses`, {
          params: {
            fromCity,
            toCity,
            travelDate,
            busTypes: Object.keys(filters.busTypes)
              .filter((key) => filters.busTypes[key])
              .map((key) =>
                key === "seater"
                  ? "Seater"
                  : key === "sleeper"
                  ? "Sleeper"
                  : key === "ac"
                  ? "AC"
                  : "NonAC"
              )
              .join(","),
            liveTracking: filters.liveTracking,
            primo: filters.primoBus,
            seatsAvailable: filters.seatAvailability.singleSeats ? "1" : "",
          },
          timeout: 10000,
          withCredentials: true,
        });

        const fetchedBuses = Array.isArray(response.data)
          ? response.data
          : response.data.buses || [];
        setBuses(fetchedBuses);
        if (response.data.error) {
          setError(response.data.error);
          toast.warn(response.data.error);
        } else if (fetchedBuses.length === 0) {
          setError("No buses found for the selected criteria.");
          toast.info("No buses available. Try different filters.");
        }
      } catch (err) {
        console.error("Fetch buses error:", err);
        let errorMessage;
        if (err.response) {
          errorMessage =
            err.response.data?.error ||
            `Server error: ${err.response.statusText}`;
          toast.error(errorMessage);
        } else if (err.request) {
          errorMessage =
            "Network error or CORS issue. Please check your connection or contact support.";
          toast.error("Unable to connect to the server. Please try again.");
        } else {
          errorMessage = "An unexpected error occurred. Please try again.";
          toast.error("An unexpected error occurred.");
        }
        setError(errorMessage);
        setBuses([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [fromCity, toCity, travelDate, filters]
  );

  const handleFilterChange = useCallback(
    debounce((newFilters) => {
      setFilters(newFilters);
      const newQueryParams = new URLSearchParams({
        fromCity,
        toCity,
        travelDate,
        busTypes: Object.keys(newFilters.busTypes)
          .filter((key) => newFilters.busTypes[key])
          .map((key) =>
            key === "seater"
              ? "Seater"
              : key === "sleeper"
              ? "Sleeper"
              : key === "ac"
              ? "AC"
              : "NonAC"
          )
          .join(","),
        liveTracking: newFilters.liveTracking.toString(),
        primo: newFilters.primoBus.toString(),
        seatsAvailable: newFilters.seatAvailability.singleSeats ? "1" : "",
      });
      navigate(`/search?${newQueryParams.toString()}`, { replace: true });
    }, 300),
    [navigate, fromCity, toCity, travelDate]
  );

  useEffect(() => {
    fetchBuses();
    return () => {
      fetchBuses.cancel();
      handleFilterChange.cancel();
    };
  }, [fetchBuses, handleFilterChange]);

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <i className={`fa-solid ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          buses={buses}
        />
      </aside>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {error && (
          <motion.div
            className="text-center text-red-500 bg-red-100 p-4 rounded-md mb-4"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
            <button
              onClick={() => fetchBuses()}
              className="ml-4 text-primary underline hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary"
            >
              Retry
            </button>
          </motion.div>
        )}
        {isLoading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="animate-spin h-8 w-8 text-primary dark:text-primary-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading buses...
            </span>
          </motion.div>
        ) : buses.length === 0 && !error ? (
          <motion.div
            className="text-center text-gray-600 dark:text-gray-300 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No buses found. Try adjusting your filters or search criteria.
            <button
              onClick={() => navigate("/")}
              className="ml-2 text-primary underline hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary"
            >
              Go to Homepage
            </button>
          </motion.div>
        ) : (
          <AvailableBuses buses={buses} filters={filters} />
        )}
      </div>
    </motion.div>
  );
};

export default SearchPage;
