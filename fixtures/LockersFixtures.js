const Lockers = require('../models/Locker');

const loadLockersFixtures = async () => {

    // Supprime les anciennes données (optionnel)
    await Lockers.deleteMany({});

    const lockers = [
        {
            lockerNumber: 1,
            lockerSize: 'small',
            lockerPrice: 100
        },
        {
            lockerNumber: 2,
            lockerSize: 'large',
            lockerPrice: 200
        },
        {
            lockerNumber: 3,
            lockerSize: 'medium',
            lockerPrice: 300
        },
        {
            lockerNumber: 4,
            lockerSize: 'large',
            lockerPrice: 200
        },
        {
            lockerNumber: 5,
            lockerSize: 'small',
            lockerPrice: 200
        },
        {
            lockerNumber: 6,
            lockerSize: 'small',
            lockerPrice: 100
        }

    ];

    await Lockers.insertMany(lockers);

};


module.exports = loadLockersFixtures;
