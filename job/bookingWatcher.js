const Booking = require('../models/Booking');
const User = require('../models/User');
const Locker = require('../models/Locker');
const {readFileSync} = require("node:fs");
const {join} = require("node:path");
const sendEmail = require("../utils/mailer");

async function checkBookingToRemindUser(reminderDurationMinutes, intervalMs) {
    const now = new Date();

    try {
        const lowerBound = new Date(new Date().setMinutes(now.getMinutes() + reminderDurationMinutes));
        const upperBound = new Date(new Date().setMinutes(now.getMinutes() + reminderDurationMinutes + Math.floor(intervalMs/60000)));

        const bookingsToRemind = await Booking.find({
            endDate: {$gt: lowerBound, $lte: upperBound}
        });


        for (const booking of bookingsToRemind) {
            const user = await User.findById(booking.user);
            const locker = await Locker.findById(booking.locker)


            const emailTemplatePath = join(__dirname, '..', 'views', 'emails', 'reminder-expiration.html');
            let emailHTML = readFileSync(emailTemplatePath, 'utf8');
            emailHTML = emailHTML.replace('{{userName}}', user.firstName)
                .replace('{{lockerNumber}}', locker.lockerNumber)
                .replace('{{reminderTimeMinutes}}', reminderDurationMinutes);

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

module.exports = function startBookingWatcher(reminderDurationMinutes = 30, intervalMs = 60 * 1000) {
    checkExpiredBookings();
    checkBookingToRemindUser(reminderDurationMinutes, intervalMs);
    setInterval(checkExpiredBookings, intervalMs);
    setInterval(checkBookingToRemindUser, intervalMs, reminderDurationMinutes, intervalMs);
};
