const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/api_in_case_of');
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion ', error);
        process.exit(1);
    }
}

module.exports = connectDB;