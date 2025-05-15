import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("HeroSection mounted");
    // return () => console.log("HeroSection unmounted");
  }, []);

  const handleBookNow = () => {
    console.log("Book Now clicked");
    try {
      navigate("/search");
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/search";
    }
  };

  return (
    <section
      className="bg-gradient-to-r from-blue-50 to-blue-100 py-16"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h2
            id="hero-heading"
            className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4"
          >
            Book Your Bus Tickets with Ease
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Explore thousands of routes, compare prices, and book your journey in
            minutes. Travel comfortably with India's top bus operators.
          </p>
          <button
            onClick={handleBookNow}
            className="bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
            aria-label="Book bus tickets now"
          >
            Book Now
          </button>
        </div>
        <div className="md:w-1/2">
          <div
            className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600"
            aria-hidden="true"
          >
            Placeholder Image
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;