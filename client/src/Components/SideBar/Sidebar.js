import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="filter-section">
        <h3>Live Tracking (30)</h3>
        <label>
          <input type="checkbox" />
          Live Tracking
        </label>
      </div>
      <div className="filter-section">
        <h3>Primo Bus (9)</h3>
        <label>
          <input type="checkbox" />
          Primo Bus
        </label>
      </div>
      <div className="filter-section">
        <h3>Departure Time</h3>
        <label>
          <input type="checkbox" />
          Before 6 am (0)
        </label>
        <label>
          <input type="checkbox" />6 am to 12 pm (0)
        </label>
        <label>
          <input type="checkbox" />
          12 pm to 6 pm (34)
        </label>
        <label>
          <input type="checkbox" />
          After 6 pm (12)
        </label>
      </div>
      <div className="filter-section">
        <h3>Bus Types</h3>
        <label>
          <input type="checkbox" />
          Seater (23)
        </label>
        <label>
          <input type="checkbox" />
          Sleeper (39)
        </label>
        <label>
          <input type="checkbox" />
          AC (35)
        </label>
        <label>
          <input type="checkbox" />
          NonAC (11)
        </label>
      </div>
      <div className="filter-section">
        <h3>Seat Availability</h3>
        <label>
          <input type="checkbox" />
          Single Seats (35)
        </label>
      </div>
      <div className="filter-section">
        <h3>Arrival Time</h3>
        <label>
          <input type="checkbox" />
          Before 6 am (32)
        </label>
        <label>
          <input type="checkbox" />6 am to 12 pm (9)
        </label>
        <label>
          <input type="checkbox" />
          12 pm to 6 pm (0)
        </label>
        <label>
          <input type="checkbox" />
          After 6 pm (5)
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
