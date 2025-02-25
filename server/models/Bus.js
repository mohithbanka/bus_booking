const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  bus_number: { type: String, required: true },
  operator: { type: String, required: true },
  capacity: { type: Number, required: true },
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  departure_time: { type: Date, required: true },
  arrival_time: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bus', busSchema);
