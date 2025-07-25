const User = require('../models/User');
const bcrypt = require('bcrypt');
const { createSendToken, signToken} = require('../utils/jwt');
const {promisify} = require("util");
const crypto = require('crypto');
const sendEmail = require('../utils/mailer');
const path = require('path');
const fs = require("fs");

exports.showRegister = (req, res) => {
    res.render('authentification/register', { title: 'Créer un compte' });
};

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('authentification/register', {
                title: 'Créer un compte',
                error: 'Cet utilisateur existe déjà.',
                formData: req.body
            });
        }

        if (password.length < 8) {
            return res.status(400).render('authentification/register', {
                title: 'Créer un compte',
                error: 'Le mot de passe doit contenir au moins 8 caractères.',
                formData: req.body
            });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).render('authentification/register', {
                title: 'Créer un compte',
                error: 'Le mot de passe doit contenir au moins une majuscule.',
                formData: req.body
            });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).render('authentification/register', {
                title: 'Créer un compte',
                error: 'Le mot de passe doit contenir au moins un chiffre.',
                formData: req.body
            });
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).render('authentification/register', {
                title: 'Créer un compte',
                error: 'Le mot de passe doit contenir au moins un caractère spécial.',
                formData: req.body
            });
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

        const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'welcome.html');
        let emailHTML = fs.readFileSync(emailTemplatePath, 'utf-8');
        emailHTML = emailHTML.replace('{{firstName}}', firstName);

        await sendEmail({
            to: email,
            subject: 'Bienvenue sur InCaseOf 🎉',
            html: emailHTML
        });

        res.redirect('/auth/login');
    } catch (error) {
        res.status(500).render('authentification/register', {
            title: 'Créer un compte',
            error: 'Erreur lors de la création de l\'utilisateur.',
            formData: req.body
        });
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
            return res.status(401).render('authentification/login', { title: 'Connexion', error: 'Utilisateur non trouvé.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('authentification/login', { title: 'Connexion', error: 'Mot de passe incorrect.' });
        }

        const token = createSendToken(user, 200, res);
        if (token) {
            return res.redirect('/');
        }
    } catch (error) {
        res.status(500).render('authentification/login', { title: 'Connexion', error: 'Une erreur est survenue. Veuillez réessayer.' });
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

        const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'reset-password.html');
        let emailHTML = fs.readFileSync(emailTemplatePath, 'utf-8');
        emailHTML = emailHTML.replace('{{resetURL}}', resetURL);

        await sendEmail({
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe',
            html: emailHTML
        });

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
        return res.status(400).render('authentification/reset-password', {
            token: req.params.token,
            error: 'Token invalide ou expiré.'
        });
    }

    if (req.body.password !== req.body.passwordConfirm) {
        return res.status(400).render('authentification/reset-password', {
            token: req.params.token,
            error: 'Les mots de passe ne correspondent pas.'
        });
    }

    if (req.body.password.length < 8) {
        return res.status(400).render('authentification/reset-password', {
            token: req.params.token,
            error: 'Le mot de passe doit contenir au moins 8 caractères.'
        });
    }
    if (!/[A-Z]/.test(req.body.password)) {
        return res.status(400).render('authentification/reset-password', {
            token: req.params.token,
            error: 'Le mot de passe doit contenir au moins une majuscule.'
        });
    }
    if (!/[0-9]/.test(req.body.password)) {
        return res.status(400).render('authentification/reset-password', {
            token: req.params.token,
            error: 'Le mot de passe doit contenir au moins un chiffre.'
        });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(req.body.password)) {
        return res.status(400).render('authentification/reset-password', {
            token: req.params.token,
            error: 'Le mot de passe doit contenir au moins un caractère spécial.'
        });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
    res.redirect('/');
};