const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true, trim: true },
  operator: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ["Seater", "Sleeper", "AC", "NonAC"],
  },
  capacity: { type: Number, required: true, min: 1 },
  seatsAvailable: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  liveTracking: { type: Boolean, default: false },
  primo: { type: Boolean, default: false },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

busSchema.index({ routeId: 1 });
busSchema.index({ departureTime: 1 });
busSchema.index({ type: 1 });
busSchema.index({ liveTracking: 1 });
busSchema.index({ primo: 1 });
busSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Bus", busSchema);