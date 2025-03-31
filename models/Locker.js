const mongoose = require("mongoose");

const lockerSchema = new mongoose.Schema({
  lockerNumber: {
    type: Number,
    unique: true,
  },
  lockerSize: {
    size: Number,
  },
  lockerPrice: {
    type: Number,
  },
  lockerStatus: {
    type: Number,
    default: 1, // 1 for available, 0 for booked, 2 for under maintenance
  },
});

module.exports = mongoose.model("Locker", lockerSchema);
