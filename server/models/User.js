const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for regular login, not Google login
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
  bookings: [
    {
      busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
      seats: Number,
      date: Date,
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
