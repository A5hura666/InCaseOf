const express = require('express');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const path = require("path");

// Configuration de Twig
app.set('view engine', 'twig');
app.set('views', './views');

// Middleware pour les fichiers statiques (CSS, JS, images)
app.use(express.static('public'));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'twig');
app.set("twig options", { cache: false });
app.use(express.static(path.join(__dirname, "public")));

// Limit requests
const limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter);
app.use(express.json());
app.use(cors());

// ROUTES GO HERE
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil' });
});

app.use('/api/lockers', require('./routes/lockers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});