const Booking = require('../models/Booking');
const Locker = require('../models/Locker');

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
        console.error('Error checking expired bookings:', err);
    }
}

module.exports = function startBookingWatcher(intervalMs = 60 * 1000) {
    setInterval(checkExpiredBookings, intervalMs);
};
