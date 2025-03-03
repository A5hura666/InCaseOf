const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
    lockerNumber: {
        type: Number,
        unique: true
    },
    lockerSize: {
        size: Number,
    },
    lockerPrice: {
        type: Number,
    },
    lockerStatus: {
        type: Number,
        default: 'Available'
    }
});

module.exports = mongoose.model('Locker', lockerSchema);