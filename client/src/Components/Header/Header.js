import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDownIcon, CalendarIcon } from "lucide-react";

// List of major Indian cities
const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Ahmedabad", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik",
  "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad",
  "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah",
  "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai",
  "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad",
  "Tiruchirappalli", "Tiruppur", "Moradabad", "Mysore", "Bareilly",
  "Gurgaon", "Aligarh", "Jalandhar", "Bhubaneswar", "Salem", "Warangal",
  "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati",
  "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi",
  "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela",
  "Nanded", "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar",
  "Ujjain", "Loni", "Siliguri", "Jhansi", "Ulhasnagar", "Jammu",
  "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum", "Ambattur",
  "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur", "Maheshtala"
].map(city => city.toUpperCase());

// Utility functions
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const formatDate = (date) => date.toISOString().split("T")[0];

const Header = () => {
  const today = formatDate(new Date());
  const tomorrow = formatDate(new Date(Date.now() + 86400000));

  const [fromCity, setFromCity] = useState(() => localStorage.getItem("fromCity") || "");
  const [toCity, setToCity] = useState(() => localStorage.getItem("toCity") || "");
  const [travelDate, setTravelDate] = useState(() => localStorage.getItem("travelDate") || today);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);
  const [fromHighlightedIndex, setFromHighlightedIndex] = useState(-1);
  const [toHighlightedIndex, setToHighlightedIndex] = useState(-1);
  const [geolocationError, setGeolocationError] = useState(null);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem("recentSearches")) || []);
  const [toast, setToast] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toSuggestionsRef = useRef(null);

  // Load saved data
  useEffect(() => {
    const savedFromCity = localStorage.getItem("fromCity");
    const savedToCity = localStorage.getItem("toCity");
    const savedTravelDate = localStorage.getItem("travelDate");
    if (savedFromCity) setFromCity(savedFromCity);
    if (savedToCity) setToCity(savedToCity);
    if (savedTravelDate) setTravelDate(savedTravelDate);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Geolocation
  const getCurrentCity = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation is not supported by your browser.");
      return;
    }
    if (isGeolocationLoading) return;
    setIsGeolocationLoading(true);
    setGeolocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );

      const city = response.data.address.city || response.data.address.town || response.data.address.village;
      if (city) {
        const matchedCity = INDIAN_CITIES.find(c => c.toLowerCase() === city.toLowerCase());
        if (matchedCity) {
          setFromCity(matchedCity);
          localStorage.setItem("fromCity", matchedCity);
          setGeolocationError(null);
        } else {
          setGeolocationError("Detected city not in our service area. Please enter manually.");
        }
      } else {
        setGeolocationError("Unable to determine city from location.");
      }
    } catch (error) {
      console.error("Geolocation error:", error);
      setGeolocationError(
        error.code === 1
          ? "Location access denied. Please enter city manually or allow access."
          : error.code === 2
          ? "Location unavailable. Please enter city manually."
          : "Failed to get location. Please try again."
      );
    } finally {
      setIsGeolocationLoading(false);
    }
  }, [isGeolocationLoading]);

  // Suggestion filtering
  const filterSuggestions = useMemo(() => (value) => {
    if (value.length === 0) return [];
    return INDIAN_CITIES
      .filter(city => city.toLowerCase().startsWith(value.toLowerCase()))
      .slice(0, 5);
  }, []);

  const debouncedHandleCityInput = useCallback(
    debounce((value, setCity, setSuggestions, setHighlightedIndex) => {
      setCity(value);
      setHighlightedIndex(-1);
      setSuggestions(filterSuggestions(value));
    }, 300),
    [filterSuggestions]
  );

  // Suggestion selection
  const handleSuggestionClick = (city, setCity, setSuggestions, setHighlightedIndex, setFocused) => {
    setCity(city);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setFocused(false);
    localStorage.setItem(setCity === setFromCity ? "fromCity" : "toCity", city);
  };

  // Keyboard navigation
  const handleKeyDown = (e, suggestions, highlightedIndex, setHighlightedIndex, setCity, setSuggestions, setFocused, inputRef) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = highlightedIndex < suggestions.length - 1 ? highlightedIndex + 1 : 0;
      setHighlightedIndex(newIndex);
      const suggestionElement = inputRef.current?.nextSibling?.children[newIndex];
      suggestionElement?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = highlightedIndex > 0 ? highlightedIndex - 1 : suggestions.length - 1;
      setHighlightedIndex(newIndex);
      const suggestionElement = inputRef.current?.nextSibling?.children[newIndex];
      suggestionElement?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex], setCity, setSuggestions, setHighlightedIndex, setFocused);
      inputRef.current.focus();
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setFocused(false);
      inputRef.current.focus();
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fromInputRef.current &&
        !fromInputRef.current.contains(event.target) &&
        toInputRef.current &&
        !toInputRef.current.contains(event.target) &&
        fromSuggestionsRef.current &&
        !fromSuggestionsRef.current.contains(event.target) &&
        toSuggestionsRef.current &&
        !toSuggestionsRef.current.contains(event.target)
      ) {
        setFromSuggestions([]);
        setToSuggestions([]);
        setIsFromFocused(false);
        setIsToFocused(false);
        setFromHighlightedIndex(-1);
        setToHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validation and navigation logic
  const validateAndNavigate = (from, to, date) => {
    if (isNavigating) return false;
    setIsNavigating(true);

    if (!from || !to || !date) {
      setToast({ message: "Please fill in all fields: From City, To City, and Travel Date.", type: "error" });
      setIsNavigating(false);
      return false;
    }
    if (!INDIAN_CITIES.includes(from.toUpperCase()) || !INDIAN_CITIES.includes(to.toUpperCase())) {
      setToast({ message: "Please select valid cities from the suggestions.", type: "error" });
      setIsNavigating(false);
      return false;
    }
    if (from.toUpperCase() === to.toUpperCase()) {
      setToast({ message: "From City and To City cannot be the same.", type: "error" });
      setIsNavigating(false);
      return false;
    }
    if (new Date(date) < new Date(today)) {
      setToast({ message: "Travel date cannot be in the past.", type: "error" });
      setIsNavigating(false);
      return false;
    }

    const newSearch = { fromCity: from.toUpperCase(), toCity: to.toUpperCase(), travelDate: date };
    const updatedSearches = [newSearch, ...recentSearches.filter(
      s => s.fromCity !== newSearch.fromCity || s.toCity !== newSearch.toCity || s.travelDate !== newSearch.travelDate
    )].slice(0, 3);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    localStorage.setItem("fromCity", from.toUpperCase());
    localStorage.setItem("toCity", to.toUpperCase());
    localStorage.setItem("travelDate", date);

    navigate(`/search?fromCity=${from.toUpperCase()}&toCity=${to.toUpperCase()}&travelDate=${date}`);
    setIsNavigating(false);
    return true;
  };

  // Search handler
  const handleSearch = () => {
    validateAndNavigate(fromCity, toCity, travelDate);
  };

  // Today handler
  const handleToday = () => {
    setTravelDate(today);
    localStorage.setItem("travelDate", today);
    validateAndNavigate(fromCity, toCity, today);
  };

  // Tomorrow handler
  const handleTomorrow = () => {
    setTravelDate(tomorrow);
    localStorage.setItem("travelDate", tomorrow);
    validateAndNavigate(fromCity, toCity, tomorrow);
  };

  // Clear inputs
  const clearInputs = () => {
    setFromCity("");
    setToCity("");
    setTravelDate(today);
    setFromSuggestions([]);
    setToSuggestions([]);
    setFromHighlightedIndex(-1);
    setToHighlightedIndex(-1);
    setGeolocationError(null);
    localStorage.removeItem("fromCity");
    localStorage.removeItem("toCity");
    localStorage.removeItem("travelDate");
  };

  // Swap handler
  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    localStorage.setItem("fromCity", toCity);
    localStorage.setItem("toCity", temp);
    debouncedHandleCityInput(toCity, setFromCity, setFromSuggestions, setFromHighlightedIndex);
    debouncedHandleCityInput(temp, setToCity, setToSuggestions, setToHighlightedIndex);
  };

  // Recent search handler
  const handleRecentSearch = (search) => {
    setFromCity(search.fromCity);
    setToCity(search.toCity);
    setTravelDate(search.travelDate);
    localStorage.setItem("fromCity", search.fromCity);
    localStorage.setItem("toCity", search.toCity);
    localStorage.setItem("travelDate", search.travelDate);
    navigate(`/search?fromCity=${search.fromCity}&toCity=${search.toCity}&travelDate=${search.travelDate}`);
  };

  return (
    <header className="bg-gradient-to-r from-primary to-blue-600 text-white py-12 px-4 sm:px-6 lg:px-10 flex justify-center items-center min-h-[300px]">
      <div className="header-container max-w-4xl w-full relative">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white text-sm font-medium z-50 ${
                toast.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
              role="alert"
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          India's No. 1 Online Bus Ticket Booking Site
        </h1>
        <div className="search-form bg-white rounded-lg shadow-xl p-6 flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
          {/* From City */}
          <div className="w-full sm:flex-1 relative" ref={fromInputRef}>
            <label htmlFor="fromCity" className="sr-only">From City</label>
            <div className="relative">
              <input
                type="text"
                id="fromCity"
                value={fromCity}
                onChange={(e) => debouncedHandleCityInput(e.target.value, setFromCity, setFromSuggestions, setFromHighlightedIndex)}
                onFocus={() => {
                  setIsFromFocused(true);
                  debouncedHandleCityInput(fromCity, setFromCity, setFromSuggestions, setFromHighlightedIndex);
                  if (!fromCity && !isGeolocationLoading) getCurrentCity();
                }}
                onKeyDown={(e) => handleKeyDown(
                  e, fromSuggestions, fromHighlightedIndex, setFromHighlightedIndex,
                  setFromCity, setFromSuggestions, setIsFromFocused, fromInputRef
                )}
                placeholder="From City (e.g., Delhi)"
                className={`w-full px-4 py-3 rounded-md border ${
                  geolocationError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300`}
                aria-required="true"
                aria-invalid={!!geolocationError}
                autoComplete="off"
              />
              {isGeolocationLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
            </div>
            {geolocationError && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                {geolocationError}
                <button
                  onClick={getCurrentCity}
                  className="underline text-blue-600 hover:text-blue-800"
                  disabled={isGeolocationLoading}
                >
                  Retry
                </button>
              </p>
            )}
            <AnimatePresence>
              {isFromFocused && fromSuggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
                  ref={fromSuggestionsRef}
                >
                  {fromSuggestions.map((city, index) => (
                    <li
                      key={city}
                      onClick={() => handleSuggestionClick(city, setFromCity, setFromSuggestions, setFromHighlightedIndex, setIsFromFocused)}
                      className={`px-4 py-2 text-gray-800 cursor-pointer transition-colors duration-200 ${
                        index === fromHighlightedIndex ? "bg-gray-100" : "hover:bg-gray-100"
                      }`}
                      aria-selected={index === fromHighlightedIndex}
                    >
                      {city}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Swap Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSwap}
            className="relative p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-all duration-300 group"
            aria-label="Swap From and To cities"
          >
            <ArrowUpDownIcon className="h-6 w-6" />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Swap Cities
            </span>
          </motion.button>

          {/* To City */}
          <div className="w-full sm:flex-1 relative" ref={toInputRef}>
            <label htmlFor="toCity" className="sr-only">To City</label>
            <input
              type="text"
              id="toCity"
              value={toCity}
              onChange={(e) => debouncedHandleCityInput(e.target.value, setToCity, setToSuggestions, setToHighlightedIndex)}
              onFocus={() => {
                setIsToFocused(true);
                debouncedHandleCityInput(toCity, setToCity, setToSuggestions, setToHighlightedIndex);
              }}
              onKeyDown={(e) => handleKeyDown(
                e, toSuggestions, toHighlightedIndex, setToHighlightedIndex,
                setToCity, setToSuggestions, setIsToFocused, toInputRef
              )}
              placeholder="To City (e.g., Mumbai)"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300"
              aria-required="true"
              autoComplete="off"
            />
            <AnimatePresence>
              {isToFocused && toSuggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
                  ref={toSuggestionsRef}
                >
                  {toSuggestions.map((city, index) => (
                    <li
                      key={city}
                      onClick={() => handleSuggestionClick(city, setToCity, setToSuggestions, setToHighlightedIndex, setIsToFocused)}
                      className={`px-4 py-2 text-gray-800 cursor-pointer transition-colors duration-200 ${
                        index === toHighlightedIndex ? "bg-gray-100" : "hover:bg-gray-100"
                      }`}
                      aria-selected={index === toHighlightedIndex}
                    >
                      {city}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Travel Date */}
          <div className="w-full sm:flex-1">
            <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-1">
              Travel Date
            </label>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="date"
                  id="travelDate"
                  value={travelDate}
                  onChange={(e) => {
                    setTravelDate(e.target.value);
                    localStorage.setItem("travelDate", e.target.value);
                  }}
                  min={today}
                  className={`w-full px-4 py-3 rounded-md border ${
                    travelDate && new Date(travelDate) < new Date(today) ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300 pr-10`}
                  aria-required="true"
                  aria-invalid={travelDate && new Date(travelDate) < new Date(today)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToday}
                  className={`px-3 py-1.5 text-sm rounded-md border font-semibold flex items-center gap-1 ${
                    travelDate === today
                      ? "bg-secondary text-white border-secondary"
                      : "bg-white text-secondary border-secondary hover:bg-secondary/10"
                  } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50`}
                  aria-pressed={travelDate === today}
                  aria-label="Search buses for today"
                  disabled={isNavigating}
                >
                  {isNavigating && travelDate === today ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    "Today"
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTomorrow}
                  className={`px-3 py-1.5 text-sm rounded-md border font-semibold flex items-center gap-1 ${
                    travelDate === tomorrow
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-primary border-primary hover:bg-primary/10"
                  } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50`}
                  aria-pressed={travelDate === tomorrow}
                  aria-label="Search buses for tomorrow"
                  disabled={isNavigating}
                >
                  {isNavigating && travelDate === tomorrow ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    "Tomorrow"
                  )}
                </motion.button>
              </div>
            </div>
            {travelDate && new Date(travelDate) < new Date(today) && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                Travel date cannot be in the past.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 disabled:opacity-50 w-full sm:w-auto"
              disabled={isNavigating || !fromCity || !toCity || !travelDate || new Date(travelDate) < new Date(today)}
            >
              Search Buses
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearInputs}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 w-full sm:w-auto"
            >
              Clear
            </motion.button>
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Recent Searches</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {recentSearches.map((search, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRecentSearch(search)}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-all duration-300"
                >
                  {search.fromCity} → {search.toCity} ({new Date(search.travelDate).toLocaleDateString()})
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;