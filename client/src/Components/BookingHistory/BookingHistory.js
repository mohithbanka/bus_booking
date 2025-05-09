import React from "react";

const BookingHistory = ({ bookings }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking History</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition"
            >
              <div>
                <p className="text-lg font-medium text-gray-700">{booking.route}</p>
                <p className="text-sm text-gray-500">{booking.date}</p>
              </div>
              <p className="text-lg font-semibold text-blue-600">{booking.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory;