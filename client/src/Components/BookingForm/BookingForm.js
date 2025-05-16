import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BookingForm = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const busId = queryParams.get("busId");
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/bookings`,  // Using dynamic URL from .env
        {
          busId,
          seatNumbers,
          journeyDate: queryParams.get("travelDate"),
          totalAmount: seatNumbers.length * 1500, // Assuming price per seat is 1500
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/my-trips");
      window.gtag("event", "booking_created", {
        event_category: "Booking",
        bookingId: response.data.booking._id,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary mb-6">Book Your Bus</h2>
      {error && (
        <div className="text-red-500 bg-red-100 p-4 rounded-md mb-6" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Seat Numbers</label>
          <input
            type="text"
            value={seatNumbers.join(",")}
            onChange={(e) => setSeatNumbers(e.target.value.split(",").filter(Boolean))}
            placeholder="e.g., A1,A2"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            disabled={loading}
          >
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-secondary text-white py-2 rounded-md hover:bg-secondary/90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
