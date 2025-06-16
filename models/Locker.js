const mongoose = require("mongoose");

const lockerSchema = new mongoose.Schema({
  lockerNumber: {
    type: Number,
    unique: true,
  },
  lockerSize: {
    size: Number,
    required: true,
    min: 1
  },
  lockerPrice: {
    type: Number,
  },
  lockerStatus: {
    type: Number,
    enum: [0, 1, 2], // 0 = réservé, 1 = dispo, 2 = maintenance
    default: 1
  },
});

module.exports = mongoose.model("Locker", lockerSchema);
