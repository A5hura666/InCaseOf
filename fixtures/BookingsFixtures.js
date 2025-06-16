const Bookings = require('../models/Booking');
const Users = require('../models/User');
const Lockers = require('../models/Locker');

const loadBookingsFixtures = async () => {

    // Supprime les anciennes données (optionnel)
    await Bookings.deleteMany({});

    const users = await Users.find({});

    const lockers = await Lockers.find({});

    if (users.length === 0 || lockers.length === 0) {
        console.log('no user or locker found (user = ' + users.length + ', locker = ' + lockers.length + ')');
    }

    const bookings = [
        {
            user: users[0]._id,
            locker: lockers[0]._id,
            bookingDate: new Date(),
            bookingDuration: 1
        },
        {
            user: users[1]._id,
            locker: lockers[1]._id,
            bookingDate: new Date(),
            bookingDuration: 1,
        },
        {
            user: users[2]._id,
            locker: lockers[2]._id,
            bookingDate: new Date(),
            bookingDuration: 1,
        }
    ];

    await Bookings.insertMany(bookings);

};


module.exports = loadBookingsFixtures;
