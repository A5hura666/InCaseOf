const User = require('../models/User');
const bcrypt = require('bcrypt');
const { createSendToken, signToken} = require('../utils/jwt');
const {promisify} = require("util");

exports.showRegister = (req, res) => {
    res.render('authentification/register', { title: 'Créer un compte' });
};

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Cet utilisateur existe déjà.');
        }

        if (!password || password.trim() === '') {
            return res.status(400).send('Le mot de passe est requis.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la création de l\'utilisateur');
    }
};

exports.showLogin = (req, res) => {
    res.render('authentification/login', { title: 'Se connecter' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send('Utilisateur non trouvé');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Mot de passe incorrect');
        }

        const token = createSendToken(user, 200, res);
        if (token) {
            return res.redirect('/');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};


exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
    });

    return res.redirect('/');
};