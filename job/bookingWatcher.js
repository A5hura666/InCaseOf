const Booking = require('../models/Booking');
const User = require('../models/User');
const Locker = require('../models/Locker');
const {readFileSync} = require("node:fs");
const {join} = require("node:path");
const sendEmail = require("../utils/mailer");

async function checkBookingToRemindUser() {
    //console.log("Checking Booking : reminder");
    const now = new Date();

    try {
        let options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        };
        const lowerBound = new Date(new Date().setMinutes(now.getMinutes() + 30));
        const upperBound = new Date(new Date().setMinutes(now.getMinutes() + 31));

        //console.log("Checking Booking between " + lowerBound.toLocaleDateString("fr-FR", options) + " and " + upperBound.toLocaleDateString("fr-FR", options));

        const bookingsToRemind = await Booking.find({
            endDate: {$gt: lowerBound, $lte: upperBound}
        });

        //console.log("bookingsToRemind: ", bookingsToRemind);

        for (const booking of bookingsToRemind) {
            const user = await User.findById(booking.user);
            const locker = await Locker.findById(booking.locker)

            //console.log("user: ", user);
            //console.log("locker: ", locker);

            const emailTemplatePath = join(__dirname, '..', 'views', 'emails', 'reminder-expiration.html');
            let emailHTML = readFileSync(emailTemplatePath, 'utf8');
            emailHTML = emailHTML.replace('{{userName}}', user.firstName).replace('{{lockerNumber}}', locker.lockerNumber);

            await sendEmail({
                to: user.email,
                subject: 'Rappel : votre réservation arrive à expiration',
                html: emailHTML
            });

            console.log('Sent reminder email to ', user.firstName);
        }
    } catch (err) {
        console.error('Error checking booking reminder: ', err);
    }
}

async function checkExpiredBookings() {
    console.log("Checking Booking : expiration");
    const now = new Date();

    try {
        const expiredBookings = await Booking.find({
            endDate: {$lte: now}
        });

        for (const booking of expiredBookings) {
            await Locker.findByIdAndUpdate(booking.locker, {lockerStatus: "free"});

            console.log(`Booking ${booking._id} expired and locker ${booking.locker} released`);

            await booking.deleteOne();
        }
    } catch (err) {
        console.error('Error checking expired bookings: ', err);
    }
}

module.exports = function startBookingWatcher(intervalMs = 60 * 1000) {
    checkExpiredBookings();
    checkBookingToRemindUser();
    setInterval(checkExpiredBookings, intervalMs);
    setInterval(checkBookingToRemindUser, intervalMs);
};
