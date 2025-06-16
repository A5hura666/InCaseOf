const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://root:example@127.0.0.1:27017/api_in_case_of?authSource=admin');
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion ', error);
        process.exit(1);
    }
}

module.exports = connectDB;