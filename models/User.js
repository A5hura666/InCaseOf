const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        unique: true
    },
    lastName: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    }
});

module.exports = mongoose.model('User', userSchema);