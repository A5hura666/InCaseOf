const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Configuration de Twig
app.set('view engine', 'twig');
app.set('views', './views');

// Middleware pour les fichiers statiques (CSS, JS, images)
app.use(express.static('public'));

app.use(express.json());
app.use(cors());

// ROUTES GO HERE
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil' });
});


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});