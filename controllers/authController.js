const User = require('../models/User');
const bcrypt = require('bcrypt');
const { createSendToken, signToken} = require('../utils/jwt');
const {promisify} = require("util");
const crypto = require('crypto');
const sendEmail = require('../utils/mailer');

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

exports.showForgotPassword = (req, res) => {
    res.render('authentification/forgot-password', { title: 'Mot de passe oublié' });
};


exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).render('authentification/forgot-password', { error: "Aucun utilisateur trouvé." });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        const resetURL = `${process.env.BASE_URL}/auth/reset-password/${token}`;

        console.log("Envoi du mail à:", user.email);
        await sendEmail({
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
             <a href="${resetURL}" class="text-blue-500">${resetURL}</a>`
        });
        console.log("Mail envoyé !");

        res.render('authentification/forgot-password', { message: "Un e-mail de réinitialisation a été envoyé." });
    } catch (error) {
        console.error(error);
        res.status(500).render('authentification/forgot-password', { error: "Une erreur est survenue, veuillez réessayer plus tard." });
    }
};

exports.showResetPassword = async (req, res) => {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Token invalide ou expiré.');
    }

    res.render('authentification/reset-password', { token: req.params.token });
};


exports.resetPassword = async (req, res) => {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Token invalide ou expiré.');
    }

    if (req.body.password !== req.body.passwordConfirm) {
        return res.status(400).send('Les mots de passe ne correspondent pas.');
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
    res.redirect('/');
};