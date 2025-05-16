import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
console.log("REACT_APP_API_URL:", REACT_APP_API_URL);

const MyTrips = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(response.data.bookings || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary mb-6">My Trips</h2>
      {loading && (
        <div
          className="text-center text-gray-600"
          role="status"
          aria-live="polite"
        >
          <svg
            className="animate-spin h-8 w-8 mx-auto text-primary"
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
          <p className="mt-2">Loading bookings...</p>
        </div>
      )}
      {error && (
        <div
          className="text-center text-red-500 bg-red-100 p-4 rounded-md mb-6"
          role="alert"
        >
          {error}
        </div>
      )}
      {!loading && !error && bookings.length > 0 ? (
        <div className="space-y-6" role="list" aria-label="My bookings">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-lg shadow-md"
              role="listitem"
            >
              <h3 className="text-lg font-bold text-primary">
                {booking.busId.busNumber} ({booking.busId.operator})
              </h3>
              <p className="text-gray-600">
                {booking.routeId.source} to {booking.routeId.destination}
              </p>
              <p className="text-gray-600">
                Journey: {new Date(booking.journeyDate).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Departure:{" "}
                {new Date(booking.busId.departureTime).toLocaleTimeString()}
              </p>
              <p className="text-gray-600">
                Arrival:{" "}
                {new Date(booking.busId.arrivalTime).toLocaleTimeString()}
              </p>
              <p className="text-gray-600">
                Seats: {booking.seatNumbers.join(", ")}
              </p>
              <p className="text-gray-600">Amount: ₹{booking.totalAmount}</p>
              <p className="text-gray-600">Status: {booking.status}</p>
              <p className="text-gray-600">
                Booked on: {new Date(booking.bookingDate).toLocaleString()}
              </p>
              {booking.paymentId && (
                <p className="text-gray-600">Payment ID: {booking.paymentId}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div
            className="text-center text-gray-600 bg-gray-100 p-4 rounded-md"
            role="status"
            aria-live="polite"
          >
            No bookings found.
          </div>
        )
      )}
    </div>
  );
};

export default MyTrips;
