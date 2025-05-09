const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  phone: { type: String, trim: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  // Only exclude password for non-authentication queries
  if (!this._conditions.email) {
    this.select("-password");
  }
  next();
});
module.exports = mongoose.model("User", userSchema);
