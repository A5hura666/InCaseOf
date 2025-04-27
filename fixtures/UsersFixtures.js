const Users = require('../models/User');

const loadUsersFixtures = async () => {

    // Supprime les anciennes données (optionnel)
    Users.deleteMany({});
    const users = [
        {
            email: 'joe.doe@example.com',
            password: 'password',
            firstName: 'Joe',
            lastName: 'Doe',
        },
        {
            email: 'ethan@example.com',
            password: 'password',
            firstName: 'Joe',
            lastName: 'Doe',
        },
        {
            email: 'antoine@example.com',
            password: 'password',
            firstName: 'Joe',
            lastName: 'Doe',
        },
        {
            email: 'valentin@example.com',
            password: 'password',
            firstName: 'Joe',
            lastName: 'Doe',
        },
        {
            email: 'admin@example.com',
            password: 'admin',
            firstName: 'Admin',
            lastName: 'Admin',
        },
    ];

    await Users.insertMany(users);

};

loadUsersFixtures().catch((err) => console.error(err));

module.exports = loadUsersFixtures;