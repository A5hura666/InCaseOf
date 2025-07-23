const User = require('../models/User');
const Bookings = require('../models/Booking');


exports.postUser = async (req, res) => {
    try{
        const newUser = new User(req.body);
        const registeredUser = await newUser.save();
        res.status(200).json(registeredUser);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.getUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.updateUser = async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate
        (req.params.id, req.body, {new: true});
        res.status(200).json(updatedUser);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.getBookingsByUserId = async (req, res) => {
    try{
        const bookings = await Bookings.find({user: req.params.id}).populate('locker');
        res.render('bookings', {bookings: bookings});
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedUser);
    }catch (err) {
        res.status(400).json({error: err});
    }
}