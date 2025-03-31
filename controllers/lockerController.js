const Locker = require("../models/Locker");

// Fonction pour afficher tous les casiers
exports.getAllLockers = async (req, res) => {
    try {
        const lockers = await Locker.find();
        res.render("lockers", { title: "Liste des Casiers", lockers });
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Fonction pour afficher le formulaire de création de casier
exports.showCreateLockerForm = (req, res) => {
    res.render("createLocker", { title: "Créer un Casier" });
};

// Fonction pour créer un nouveau casier
exports.createLocker = async (req, res) => {
    try {
        const newLocker = new Locker(req.body);
        const registeredLocker = await newLocker.save();
        res.status(200).json(registeredLocker);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Fonction pour obtenir un casier par ID
exports.getLockerById = async (req, res) => {
    try {
        const locker = await Locker.findById(req.params.id);
        res.status(200).json(locker);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Fonction pour mettre à jour un casier
exports.updateLocker = async (req, res) => {
    try {
        const updatedLocker = await Locker.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedLocker);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

// Fonction pour supprimer un casier
exports.deleteLocker = async (req, res) => {
    try {
        const deletedLocker = await Locker.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedLocker);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};
