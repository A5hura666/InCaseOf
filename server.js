const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const path = require("path")

app.use(express.json());
app.use(cors());

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'twig');
app.set("twig options", { cache: false });
app.use(express.static(path.join(__dirname, "public")));

// ROUTES GO HERE
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil' });
});


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});