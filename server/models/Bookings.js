const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  seat_number: { type: String, required: true },
  booking_date: { type: Date, default: Date.now },
  journey_date: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
