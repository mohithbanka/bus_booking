const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  source: { type: String, required: true, trim: true, uppercase: true },
  destination: { type: String, required: true, trim: true, uppercase: true },
  distance: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

routeSchema.index({ source: 1, destination: 1 }, { unique: true });
routeSchema.index({ source: 1 });
routeSchema.index({ destination: 1 });
routeSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Route", routeSchema);