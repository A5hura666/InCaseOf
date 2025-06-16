const mongoose = require("mongoose");

const lockerSchema = new mongoose.Schema({
  lockerNumber: {
    type: Number,
    unique: true,
  },
  lockerSize: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large'], // small, medium, large
  },
  lockerPrice: {
    type: Number,
  },
  lockerStatus: {
    type: String,
    enum: ['booked', 'free', 'blocked'],
    default: 'free',
  },
});

module.exports = mongoose.model("Locker", lockerSchema);
