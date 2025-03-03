// controllers/userController.js
const User = require('../models/User');

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const registeredUser = await newUser.save();
        res.status(200).json(registeredUser);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Mettre à jour un utilisateur par ID
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Supprimer un utilisateur par ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};
