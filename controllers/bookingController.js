const Bookings = require("../models/Booking");
const Locker = require("../models/Locker");
const User = require("../models/User");
const sendEmail = require('../utils/mailer');
const path = require('path');
const fs = require('fs');

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Bookings.find();
        res.status(200).json(bookings);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

exports.postBooking = async (req, res) => {
    try {
        const lockerBooked = await Locker.findOne({ _id: req.body.lockerId });
        const user = await User.findOne({ _id: req.body.user });
        if (lockerBooked && user) {
            const newBookings = new Bookings({
                locker: lockerBooked._id,
                user: user._id,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                totalPrice: req.body.totalPrice,
                lockerSize: lockerBooked.lockerSize,
            });

            const registeredBookings = await newBookings.save();

            lockerBooked.lockerStatus = "booked";
            await lockerBooked.save(); // attention : await sinon non bloquant

            const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'booking-confirmation.html');
            let emailHTML = fs.readFileSync(emailTemplatePath, 'utf-8');

            emailHTML = emailHTML
                .replace('{{firstName}}', user.firstName)
                .replace('{{lockerNumber}}', lockerBooked.lockerNumber)
                .replace('{{lockerSize}}', lockerBooked.lockerSize)
                .replace('{{startDate}}', new Date(req.body.startDate).toLocaleString('fr-FR'))
                .replace('{{endDate}}', new Date(req.body.endDate).toLocaleString('fr-FR'))
                .replace('{{totalPrice}}', req.body.totalPrice);

            await sendEmail({
                to: user.email,
                subject: 'Confirmation de votre réservation',
                html: emailHTML
            });

            res.status(201).json(registeredBookings);
        } else {
            res.status(400).json({ error: "Locker or user not found" });
        }
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(400).json({ error: err.message });
    }
};


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

exports.getBookingInvoice = async (req, res) => {
    try {
        const booking = await Bookings.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('locker', 'lockerNumber lockerSize');

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}
