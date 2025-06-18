const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  locker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Locker",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
});



module.exports = mongoose.model("Booking", bookingSchema);
