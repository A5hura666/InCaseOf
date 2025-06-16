const Lockers = require('../models/Locker');

const loadLockersFixtures = async () => {

    // Supprime les anciennes données (optionnel)
    await Lockers.deleteMany({});

    const lockers = [
        {
            lockerNumber: 1,
            lockerSize: 1,
            lockerPrice: 100
        },
        {
            lockerNumber: 2,
            lockerSize: 2,
            lockerPrice: 200
        },
        {
            lockerNumber: 3,
            lockerSize: 3,
            lockerPrice: 300
        },
        {
            lockerNumber: 4,
            lockerSize: 2,
            lockerPrice: 200
        },
        {
            lockerNumber: 5,
            lockerSize: 2,
            lockerPrice: 200
        },
        {
            lockerNumber: 6,
            lockerSize: 1,
            lockerPrice: 100
        }

    ];

    await Lockers.insertMany(lockers);

};


module.exports = loadLockersFixtures;
