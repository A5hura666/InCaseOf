const mongoose = require("mongoose");

const lockerSchema = new mongoose.Schema({
  lockerNumber: {
    type: Number,
    unique: true,
  },
  lockerSize: {
    type: String,
    required: true,
    enum: ['small', 'middle', 'large'], // small, middle, large
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
