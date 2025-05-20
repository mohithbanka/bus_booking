const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, default: "Unknown" },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"],
    sparse: true,
  },
  avatar: { type: String, trim: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  if (!this._conditions.email && !this._conditions.googleId) {
    this.select("-password");
  }
  next();
});

module.exports = mongoose.model("User", userSchema);