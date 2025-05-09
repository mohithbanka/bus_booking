const mongoose = require("mongoose");
const Bus = require("./Bus");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  seatNumbers: [{ type: String, required: true }],
  bookingDate: { type: Date, default: Date.now },
  journeyDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  totalAmount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

bookingSchema.pre("save", async function (next) {
  try {
    const bus = await Bus.findById(this.busId);
    if (!bus) {
      return next(new Error("Bus not found"));
    }
    if (bus.seatsAvailable < this.seatNumbers.length) {
      return next(new Error(`Only ${bus.seatsAvailable} seats available`));
    }
    const existingBookings = await Booking.find({
      busId: this.busId,
      journeyDate: this.journeyDate,
      seatNumbers: { $in: this.seatNumbers },
      status: { $ne: "cancelled" },
      isDeleted: { $ne: true },
    });
    if (existingBookings.length > 0) {
      return next(new Error("One or more seats already booked"));
    }
    await Bus.findByIdAndUpdate(this.busId, {
      $inc: { seatsAvailable: -this.seatNumbers.length },
    });
    next();
  } catch (error) {
    next(error);
  }
});

bookingSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

bookingSchema.index({ userId: 1 });
bookingSchema.index({ busId: 1 });
bookingSchema.index({ journeyDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);