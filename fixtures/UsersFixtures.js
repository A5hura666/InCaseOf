const Users = require('../models/User');
const bcrypt = require("bcrypt");

const loadUsersFixtures = async () => {

    // Supprime les anciennes données
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
            firstName: 'Ethan',
            lastName: 'Bourguigneau',
        },
        {
            email: 'antoine@example.com',
            password: 'password',
            firstName: 'Antoine',
            lastName: 'Berthillot',
        },
        {
            email: 'valentin@example.com',
            password: 'password',
            firstName: 'Valentin',
            lastName: 'Gelly',
        },
        {
            email: 'admin@example.com',
            password: 'admin',
            firstName: 'Admin',
            lastName: 'Admin',
        },
    ];

    for (const user of users) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    await Users.insertMany(users);
    console.log('Nouvelles fixtures Users insérées');

};

loadUsersFixtures().catch((err) => console.error(err));

module.exports = loadUsersFixtures;
