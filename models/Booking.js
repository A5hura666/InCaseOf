const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    locker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locker'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    bookingDuration: {
        type: Date,
        default: 1
    },
});

module.exports = mongoose.model('Booking', bookingSchema);