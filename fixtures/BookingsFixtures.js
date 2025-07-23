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
            totalPrice: 40,
            status: "closed",
            lockerSize: "small"
        },
        {
            user: users[0]._id,
            locker: lockers[0]._id,
            startDate: now,
            endDate: new Date().setMinutes(now.getMinutes() + 45),
            totalPrice: 200,
            status: "progress",
            lockerSize: "large"
        },
        {
            user: users[1]._id,
            locker: lockers[1]._id,
            startDate: now,
            endDate: new Date().setMinutes(now.getMinutes() + 31),
            totalPrice: 160,
            status: "progress",
            lockerSize: "medium"
        },
        {
            user: users[2]._id,
            locker: lockers[2]._id,
            startDate: now,
            endDate: new Date().setMinutes(now.getMinutes() + 2),
            totalPrice: 70,
            status: "progress",
            lockerSize: "small"
        }
    ];

    await Bookings.insertMany(bookings);

};


module.exports = loadBookingsFixtures;
