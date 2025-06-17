const Locker = require('../models/Locker');


exports.postLocker = async (req, res) => {
    try {
        const { lockerNumber, lockerSize, lockerPrice } = req.body;

        if (!lockerNumber || !lockerSize || !lockerPrice) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        const existingLocker = await Locker.findOne({ lockerNumber });
        if (existingLocker) {
            return res.status(400).json({ error: "Ce numéro de casier est déjà pris." });
        }

        const newLocker = new Locker({ lockerNumber, lockerSize, lockerPrice });
        const registeredLocker = await newLocker.save();
        res.status(201).json(registeredLocker);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur lors de la création du casier." });
    }
};

exports.getLockers = async (req, res) => {
    try{
        const lockers = await Locker.find();
        res.render('lockers/lockers-list', {
            title: 'Liste des casiers',
            lockers: lockers
        });

    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.getLockerById = async (req, res) => {
    try{
        const locker = await Locker.findById(req.params.id);
        res.status(200).json(locker);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.updateLocker = async (req, res) => {
    try{
        const updatedLocker = await Locker.findByIdAndUpdate
        (req.params.id, req.body, {new: true});
        res.status(200).json(updatedLocker);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

exports.deleteLocker = async (req, res) => {
    try{
        const deletedLocker = await Locker.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedLocker);
    }catch (err) {
        res.status(400).json({error: err});
    }
}