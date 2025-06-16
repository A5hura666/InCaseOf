const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_AUTH_CONNECT_URI}`);
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion ', error);
        process.exit(1);
    }
}

module.exports = connectDB;