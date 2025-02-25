import React from "react";
import "./BookingHistory.css";

const BookingHistory = () => {
  const bookings = [
    { id: 1, route: "Mumbai to Pune", date: "2024-12-25", price: "₹500" },
    { id: 2, route: "Delhi to Jaipur", date: "2024-12-20", price: "₹800" },
  ];

  return (
    <div className="booking-history">
      <h3>Booking History</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            <p>{booking.route}</p>
            <p>{booking.date}</p>
            <p>{booking.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingHistory;
