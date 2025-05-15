import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// List of major Indian cities for autocomplete
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

const Header = () => {
  const [fromCity, setFromCity] = useState(() => localStorage.getItem("fromCity") || "");
  const [toCity, setToCity] = useState(() => localStorage.getItem("toCity") || "");
  const [travelDate, setTravelDate] = useState(() => localStorage.getItem("travelDate") || "");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);
  const [fromHighlightedIndex, setFromHighlightedIndex] = useState(-1);
  const [toHighlightedIndex, setToHighlightedIndex] = useState(-1);
  const [geolocationError, setGeolocationError] = useState(null);
  const navigate = useNavigate();
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toSuggestionsRef = useRef(null);

  useEffect(() => {
    const savedFromCity = localStorage.getItem("fromCity");
    const savedToCity = localStorage.getItem("toCity");
    const savedTravelDate = localStorage.getItem("travelDate");
    if (savedFromCity) setFromCity(savedFromCity);
    if (savedToCity) setToCity(savedToCity);
    if (savedTravelDate) setTravelDate(savedTravelDate);
  }, []);

  // Get user's current city using geolocation
  const getCurrentCity = async () => {
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation is not supported by your browser.");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      // Use OpenStreetMap Nominatim API for reverse geocoding
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );

      const city = response.data.address.city || response.data.address.town || response.data.address.village;
      if (city) {
        // Find matching city in INDIAN_CITIES
        const matchedCity = INDIAN_CITIES.find(c => c.toLowerCase() === city.toLowerCase());
        if (matchedCity) {
          setFromCity(matchedCity);
          localStorage.setItem("fromCity", matchedCity);
          setGeolocationError(null);
        } else {
          setGeolocationError("Detected city not in our service area.");
        }
      } else {
        setGeolocationError("Unable to determine city from location.");
      }
    } catch (error) {
      console.error("Geolocation error:", error);
      if (error.code === 1) {
        setGeolocationError("Location access denied. Please enter city manually.");
      } else if (error.code === 2) {
        setGeolocationError("Location unavailable. Please enter city manually.");
      } else {
        setGeolocationError("Failed to get location. Please try again.");
      }
    }
  };

  // Handle city input changes and filter suggestions
  const handleCityInput = (value, setCity, setSuggestions, setHighlightedIndex) => {
    setCity(value);
    setHighlightedIndex(-1); // Reset highlight when typing
    if (value.length > 0) {
      const filteredCities = INDIAN_CITIES.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (city, setCity, setSuggestions, setHighlightedIndex, setFocused) => {
    setCity(city);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setFocused(false);
    localStorage.setItem(
      setCity === setFromCity ? "fromCity" : "toCity",
      city
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, suggestions, highlightedIndex, setHighlightedIndex, setCity, setSuggestions, setFocused, inputRef) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = highlightedIndex < suggestions.length - 1 ? highlightedIndex + 1 : 0;
      setHighlightedIndex(newIndex);
      if (inputRef.current && inputRef.current.nextSibling) {
        const suggestionElement = inputRef.current.nextSibling.children[newIndex];
        if (suggestionElement) {
          suggestionElement.scrollIntoView({ block: "nearest" });
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = highlightedIndex > 0 ? highlightedIndex - 1 : suggestions.length - 1;
      setHighlightedIndex(newIndex);
      if (inputRef.current && inputRef.current.nextSibling) {
        const suggestionElement = inputRef.current.nextSibling.children[newIndex];
        if (suggestionElement) {
          suggestionElement.scrollIntoView({ block: "nearest" });
        }
      }
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(
        suggestions[highlightedIndex],
        setCity,
        setSuggestions,
        setHighlightedIndex,
        setFocused
      );
      inputRef.current.focus();
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setFocused(false);
      inputRef.current.focus();
    }
  };

  // Handle clicks outside to close suggestions
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

  const handleSearch = () => {
    if (fromCity && toCity && travelDate) {
      if (
        !INDIAN_CITIES.includes(fromCity.toUpperCase()) ||
        !INDIAN_CITIES.includes(toCity.toUpperCase())
      ) {
        alert("Please select valid cities from the suggestions.");
        return;
      }
      if (fromCity.toUpperCase() === toCity.toUpperCase()) {
        alert("From City and To City cannot be the same.");
        return;
      }
      localStorage.setItem("fromCity", fromCity.toUpperCase());
      localStorage.setItem("toCity", toCity.toUpperCase());
      localStorage.setItem("travelDate", travelDate);
      navigate(`/search?fromCity=${fromCity.toUpperCase()}&toCity=${toCity.toUpperCase()}&travelDate=${travelDate}`);
    } else {
      alert("Please fill in all fields: From City, To City, and Travel Date.");
    }
  };

  const clearInputs = () => {
    setFromCity("");
    setToCity("");
    setTravelDate("");
    setFromSuggestions([]);
    setToSuggestions([]);
    setFromHighlightedIndex(-1);
    setToHighlightedIndex(-1);
    setGeolocationError(null);
    localStorage.removeItem("fromCity");
    localStorage.removeItem("toCity");
    localStorage.removeItem("travelDate");
  };

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    localStorage.setItem("fromCity", toCity);
    localStorage.setItem("toCity", temp);
    handleCityInput(toCity, setFromCity, setFromSuggestions, setFromHighlightedIndex);
    handleCityInput(temp, setToCity, setToSuggestions, setToHighlightedIndex);
  };

  return (
    <header className="bg-gradient-to-r from-primary to-blue-600 text-white py-12 px-4 sm:px-6 lg:px-10 flex justify-center items-center min-h-[300px]">
      <div className="header-container max-w-4xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          India's No. 1 Online Bus Ticket Booking Site
        </h1>
        <div className="search-form bg-white rounded-lg shadow-xl p-6 flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
          <div className="w-full sm:flex-1 relative" ref={fromInputRef}>
            <label htmlFor="fromCity" className="sr-only">
              From City
            </label>
            <input
              type="text"
              id="fromCity"
              value={fromCity}
              onChange={(e) => handleCityInput(e.target.value, setFromCity, setFromSuggestions, setFromHighlightedIndex)}
              onFocus={() => {
                setIsFromFocused(true);
                handleCityInput(fromCity, setFromCity, setFromSuggestions, setFromHighlightedIndex);
                if (!fromCity) getCurrentCity(); // Trigger geolocation on focus if empty
              }}
              onKeyDown={(e) => handleKeyDown(
                e,
                fromSuggestions,
                fromHighlightedIndex,
                setFromHighlightedIndex,
                setFromCity,
                setFromSuggestions,
                setIsFromFocused,
                fromInputRef
              )}
              placeholder="From City (e.g., Delhi)"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300"
              aria-required="true"
              autoComplete="off"
            />
            {geolocationError && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {geolocationError}
              </p>
            )}
            {isFromFocused && fromSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto" ref={fromSuggestionsRef}>
                {fromSuggestions.map((city, index) => (
                  <li
                    key={city}
                    onClick={() => handleSuggestionClick(city, setFromCity, setFromSuggestions, setFromHighlightedIndex, setIsFromFocused)}
                    className={`px-4 py-2 text-gray-800 cursor-pointer ${
                      index === fromHighlightedIndex ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                    aria-selected={index === fromHighlightedIndex}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

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

          <div className="w-full sm:flex-1 relative" ref={toInputRef}>
            <label htmlFor="toCity" className="sr-only">
              To City
            </label>
            <input
              type="text"
              id="toCity"
              value={toCity}
              onChange={(e) => handleCityInput(e.target.value, setToCity, setToSuggestions, setToHighlightedIndex)}
              onFocus={() => {
                setIsToFocused(true);
                handleCityInput(toCity, setToCity, setToSuggestions, setToHighlightedIndex);
              }}
              onKeyDown={(e) => handleKeyDown(
                e,
                toSuggestions,
                toHighlightedIndex,
                setToHighlightedIndex,
                setToCity,
                setToSuggestions,
                setIsToFocused,
                toInputRef
              )}
              placeholder="To City (e.g., Mumbai)"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400 transition-all duration-300"
              aria-required="true"
              autoComplete="off"
            />
            {isToFocused && toSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto" ref={toSuggestionsRef}>
                {toSuggestions.map((city, index) => (
                  <li
                    key={city}
                    onClick={() => handleSuggestionClick(city, setToCity, setToSuggestions, setToHighlightedIndex, setIsToFocused)}
                    className={`px-4 py-2 text-gray-800 cursor-pointer ${
                      index === toHighlightedIndex ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                    aria-selected={index === toHighlightedIndex}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
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