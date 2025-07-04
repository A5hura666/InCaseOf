const mongoose = require('mongoose');
const connectDB = require('../config/db');
const insertUsers = require('./UsersFixtures');
const insertLockers = require('./LockersFixtures');
const insertBookings = require('./BookingsFixtures');
const dotenv = require('dotenv');


const loadFixtures = async () => {
    dotenv.config();
    await connectDB();

    await insertUsers();
    await insertLockers();
    await insertBookings();

    console.log('All fixtures inserted successfully');
    mongoose.connection.close();
};

loadFixtures().catch((err) => console.error(err));
