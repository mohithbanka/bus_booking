import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [fromCity, setFromCity] = useState(() => localStorage.getItem("fromCity") || "");
  const [toCity, setToCity] = useState(() => localStorage.getItem("toCity") || "");
  const [travelDate, setTravelDate] = useState(() => localStorage.getItem("travelDate") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const savedFromCity = localStorage.getItem("fromCity");
    const savedToCity = localStorage.getItem("toCity");
    const savedTravelDate = localStorage.getItem("travelDate");
    if (savedFromCity) setFromCity(savedFromCity);
    if (savedToCity) setToCity(savedToCity);
    if (savedTravelDate) setTravelDate(savedTravelDate);
  }, []);

  const handleSearch = () => {
    if (fromCity && toCity && travelDate) {
      localStorage.setItem("fromCity", fromCity);
      localStorage.setItem("toCity", toCity);
      localStorage.setItem("travelDate", travelDate);
      navigate(`/search?fromCity=${fromCity}&toCity=${toCity}&travelDate=${travelDate}`);
    } else {
      alert("Please fill in all fields: From City, To City, and Travel Date.");
    }
  };

  const clearInputs = () => {
    setFromCity("");
    setToCity("");
    setTravelDate("");
    localStorage.removeItem("fromCity");
    localStorage.removeItem("toCity");
    localStorage.removeItem("travelDate");
  };

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    // Update localStorage with swapped values
    localStorage.setItem("fromCity", toCity);
    localStorage.setItem("toCity", temp);
  };

  return (
    <header className="bg-gradient-to-r from-primary to-blue-600 text-white py-12 px-4 sm:px-6 lg:px-10 flex justify-center items-center min-h-[300px]">
      <div className="header-container max-w-4xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          India's No. 1 Online Bus Ticket Booking Site
        </h1>
        <div className="search-form bg-white rounded-lg shadow-xl p-6 flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
          <div className="w-full sm:flex-1">
            <label htmlFor="fromCity" className="sr-only">
              From City
            </label>
            <input
              type="text"
              id="fromCity"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              placeholder="From City (e.g., Delhi)"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300"
              aria-required="true"
            />
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-all duration-300"
            aria-label="Swap From and To cities"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m-12 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>

          <div className="w-full sm:flex-1">
            <label htmlFor="toCity" className="sr-only">
              To City
            </label>
            <input
              type="text"
              id="toCity"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              placeholder="To City (e.g., Mumbai)"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300"
              aria-required="true"
            />
          </div>
          <div className="w-full sm:flex-1">
            <label htmlFor="travelDate" className="sr-only">
              Travel Date
            </label>
            <input
              type="date"
              id="travelDate"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300"
              aria-required="true"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleSearch}
              className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 w-full sm:w-auto"
              disabled={!fromCity || !toCity || !travelDate}
            >
              Search Buses
            </button>
            <button
              onClick={clearInputs}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 w-full sm:w-auto"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;