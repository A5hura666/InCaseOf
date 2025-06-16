const Locker = require('../models/Locker');

exports.postLocker = async (req, res) => {
    try{
        const newLocker = new Locker(req.body);
        const registeredLocker = await newLocker.save();
        res.status(200).json(registeredLocker);
    }catch (err) {
        res.status(400).json({error: err});
    }
}

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