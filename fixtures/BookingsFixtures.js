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

    const now = new Date();

    const bookings = [
        {
            user: users[1]._id,
            locker: lockers[2]._id,
            startDate: new Date().setHours(now.getHours() - 5),
            endDate: new Date().setHours(now.getHours() - 2),
            totalPrice: 140,
            status: "closed",
            lockerSize: "medium"
        },
        {
            user: users[0]._id,
            locker: lockers[0]._id,
            startDate: now,
            endDate: new Date().setMinutes(now.getMinutes() + 45),
            totalPrice: 80,
            status: "progress",
            lockerSize: "small"
        },
        {
            user: users[1]._id,
            locker: lockers[1]._id,
            startDate: now,
            endDate: new Date().setMinutes(now.getMinutes() + 36),
            totalPrice: 260,
            status: "progress",
            lockerSize: "large"
        },
        {
            user: users[2]._id,
            locker: lockers[2]._id,
            startDate: now,
            endDate: new Date().setMinutes(now.getMinutes() + 7),
            totalPrice: 120,
            status: "progress",
            lockerSize: "medium"
        }
    ];

    await Bookings.insertMany(bookings);

};


module.exports = loadBookingsFixtures;
