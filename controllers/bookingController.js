const Bookings = require("../models/Booking");
const {LockerManager} = require("../manager/LockerManager");


exports.getBookings = async (req, res) => {
    try {
        const fleurs = await Bookings.find();
        res.status(200).json(fleurs);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

exports.postBooking = async (req, res) => {
    try {
        const lockerBooked = LockerManager.findLockerById(req.body.lockerId);
        if (lockerBooked && lockerBooked.lockerStatus === 1) {
            const newBookings = new Bookings(req.body);
            const registeredBookings = await newBookings.save();
            lockerBooked.lockerStatus = 0;
            lockerBooked.save();
            res.status(201).json(registeredBookings);
        } else {
            res.status(400).json({ error: "Locker not available" });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

exports.getBookingByLockerId = async (req, res) => {
    try {
        const booking = await Bookings.find({locker: req.params.lockerNumber});
        res.status(200).json(booking);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

exports.getBookingsByUserId = async (req, res) => {
    try {
        const bookings = await Bookings.find({user: req.params.id});
        res.status(200).json(bookings);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Bookings.findById(req.params.id);
        res.status(200).json(booking);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

exports.updateBooking = async (req, res) => {
    try {
        const updatedBookings = await Bookings.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedBookings);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

exports.deleteBooking = async (req, res) => {
    try {
        const deletedBookings = await Bookings.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedBookings);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}
