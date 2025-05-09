import React, { useState } from "react";
import PropTypes from "prop-types";

const BusCard = ({ bus, onBookNow }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format date and time
  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Format duration (e.g., "24h 30m")
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  // Toggle details section
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div
      className="bus-card bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      role="listitem"
      aria-label={`Bus ${bus.busNumber}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        {/* Left Section: Bus Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <span>{bus.busNumber}</span>
            <span className="text-sm font-normal text-gray-600">({bus.operator})</span>
          </h3>
          <p className="text-gray-700 font-medium">{bus.type}</p>
          <div className="flex items-center gap-2 mt-2">
            <i className="fa-solid fa-map-marker-alt text-primary text-sm"></i>
            <p className="text-gray-600">
              {bus.routeId.source} → {bus.routeId.destination}
            </p>
          </div>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">Departure:</span> {formatDateTime(bus.departureTime)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Arrival:</span> {formatDateTime(bus.arrivalTime)}
          </p>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">Duration:</span> {formatDuration(bus.routeId.duration)}
          </p>
        </div>

        {/* Right Section: Price, Seats, Actions */}
        <div className="flex flex-col items-start sm:items-end gap-3">
          <p className="text-2xl font-bold text-primary">₹{bus.price}</p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Seats Available:</span> {bus.seatsAvailable}
          </p>
          <div className="flex gap-3 flex-wrap">
            {bus.liveTracking && (
              <span className="inline-flex items-center text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
                <i className="fa-solid fa-location-arrow mr-1"></i>Live Tracking
              </span>
            )}
            {bus.primo && (
              <span className="inline-flex items-center text-blue-600 text-xs font-medium bg-blue-100 px-2 py-1 rounded-full">
                <i className="fa-solid fa-star mr-1"></i>Primo
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={toggleDetails}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 text-sm"
              aria-expanded={showDetails}
              aria-controls={`details-${bus._id}`}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            <button
              onClick={onBookNow}
              className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 text-sm"
              aria-label={`Book bus ${bus.busNumber}`}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Details Section (Collapsible) */}
      {showDetails && (
        <div
          id={`details-${bus._id}`}
          className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300"
          role="region"
          aria-labelledby={`details-toggle-${bus._id}`}
        >
          <h4 className="text-md font-semibold text-gray-800 mb-2">Bus Details</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <span className="font-medium">Amenities:</span>{" "}
              {bus.amenities?.join(", ") || "Wi-Fi, Charging Points, Blankets"}
            </li>
            <li>
              <span className="font-medium">Cancellation Policy:</span>{" "}
              {bus.cancellationPolicy || "Free cancellation up to 24 hours before departure"}
            </li>
            <li>
              <span className="font-medium">Bus Type:</span> {bus.type}
            </li>
            <li>
              <span className="font-medium">Distance:</span> {bus.routeId.distance} km
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

BusCard.propTypes = {
  bus: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    busNumber: PropTypes.string.isRequired,
    operator: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    seatsAvailable: PropTypes.number.isRequired,
    liveTracking: PropTypes.bool,
    primo: PropTypes.bool,
    departureTime: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
    amenities: PropTypes.arrayOf(PropTypes.string),
    cancellationPolicy: PropTypes.string,
    routeId: PropTypes.shape({
      source: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      distance: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onBookNow: PropTypes.func.isRequired,
};

export default BusCard;