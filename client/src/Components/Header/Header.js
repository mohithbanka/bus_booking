import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (fromCity && toCity) {
      navigate(`/search?fromCity=${fromCity}&toCity=${toCity}`);
    }
  };

  return (
    <div className="header">
      <div className="header-container">
        <h1>India's No. 1 Online Bus Ticket Booking Site</h1>
        <div className="search-form">
          <input
            type="text"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            placeholder="From City"
          />
          <input
            type="text"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            placeholder="To City"
          />
          <button onClick={handleSearch}>Search Buses</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
