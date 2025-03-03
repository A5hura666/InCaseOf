const User = require('../models/User');
const bcrypt = require('bcrypt');
const { createSendToken, signToken} = require('../utils/jwt');

exports.showRegister = (req, res) => {
    res.render('register', { title: 'Créer un compte' });
};

exports.register = async (req, res) => {
    const { firstName, lastName, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ firstName });
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
    res.render('login', { title: 'Se connecter' });
};

exports.login = async (req, res) => {
    const { firstName, password } = req.body;

    try {
        const user = await User.findOne({ firstName });

        if (!user) {
            return res.status(401).send('Utilisateur non trouvé');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Mot de passe incorrect');
        }

        const isTokenIsCreated = createSendToken(user, 200, res);

        if (isTokenIsCreated) {
            return res.redirect('/');
        } else {
            return res.status(500).send('Erreur lors de la connexion. Veuillez réessayer.');
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

    res.status(200).json({ status: 'success' });
};
