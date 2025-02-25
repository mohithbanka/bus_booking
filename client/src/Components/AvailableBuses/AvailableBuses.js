import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BusCard from "../BusCard/BusCard";
import "./AvailableBuses.css";
import axios from "axios";

const AvailableBuses = () => {
  const [buses, setBuses] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromCity = queryParams.get("fromCity");
  const toCity = queryParams.get("toCity");

  useEffect(() => {
    if (fromCity && toCity) {
      axios
        .get("http://localhost:5000/buses", { params: { fromCity, toCity } })
        .then((response) => {
          console.log(response.data); // Debugging: Check API response
          setBuses(response.data.buses || []);
        })
        .catch(() => setBuses([]));
    }
  }, [fromCity, toCity]);

  return (
    <div className="available-buses">
      {buses.length > 0 ? (
        buses.map((bus) => <BusCard key={bus._id} bus={bus} />)
      ) : (
        <p>No buses available.</p>
      )}
    </div>
  );
};

export default AvailableBuses;
