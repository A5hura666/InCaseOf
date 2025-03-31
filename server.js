const express = require('express');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

dotenv.config();
connectDB();

const app = express();
const path = require("path");

// Configuration de Twig
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));
app.set("twig options", { cache: false });

// Middleware pour les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour parser les données JSON et les données de formulaire
app.use(express.json()); // Pour les requêtes avec corps JSON
app.use(express.urlencoded({ extended: true })); // Pour les requêtes avec corps application/x-www-form-urlencoded

// Limit requests
const limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})

app.use(cookieParser());
app.use('/api', limiter);
app.use(cors());

// Routes d'authentification
app.use('/auth', require('./routes/auth'));

// ROUTES GO HERE
app.get('/', (req, res) => {
    const token = req.cookies.jwt;
    let user = null;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
                user = {
                    id: decoded.id,
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    role: decoded.role
                };
            }
        });
    }
    res.render('index', { title: 'Accueil', user });
});

app.get('/lockers/create', (req, res) => {
    res.render('createLocker', { title: 'Créer un Casier' });
});

// Autres routes API
app.use('/api/lockers', require('./routes/lockers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});