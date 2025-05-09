const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String, enum: ["card", "upi", "wallet"], required: true },
  transactionId: { type: String, required: true, unique: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

paymentSchema.index({ userId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);