import React from "react";
import "./BusCard.css";

const BusCard = ({ bus, onBook }) => {
  const calculateDuration = (departure, arrival) => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);

    if (isNaN(departureDate) || isNaN(arrivalDate)) {
      return "Invalid time";
    }

    const diff = arrivalDate - departureDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bus-card">
      <div className="bus-header">
        <h3>{bus.operator}</h3>
        <p className="bus-number">{bus.bus_number}</p>
      </div>
      <div className="bus-details">
        <div className="time-section">
          <div className="time-info">
            <p className="time-label">Departure</p>
            <p className="time-value">
              {new Date(bus.departure_time).toLocaleTimeString()}
            </p>
          </div>
          <div className="duration">
            <p>{calculateDuration(bus.departure_time, bus.arrival_time)}</p>
          </div>
          <div className="time-info">
            <p className="time-label">Arrival</p>
            <p className="time-value">
              {new Date(bus.arrival_time).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="pricing-section">
          <p className="price-label">Capacity</p>
          <h4 className="price-value">{bus.capacity} seats</h4>
        </div>
      </div>
      <div className="action-section">
        <button className="book-now-button" onClick={() => onBook(bus)}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BusCard;
