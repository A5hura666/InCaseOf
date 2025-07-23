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
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["progress", "closed"],
        default: "progress",
    },
    lockerSize: {
        type: String,
        enum: ["small", "medium", "large"],
        required: true,
    }
});



module.exports = mongoose.model("Booking", bookingSchema);
