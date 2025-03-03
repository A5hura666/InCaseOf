const express = require('express');
const router = express.Router();
const Locker = require('../models/Locker');

router.post('/', async (req, res) => {
    try{
        const newFleur = new Locker(req.body);
        const registeredFleur = await newFleur.save();
        res.status(200).json(registeredFleur);
    }catch (err) {
        res.status(400).json({error: err});
    }
});

router.get('/', async (req, res) => {
    try{
        const fleurs = await Locker.find();
        res.status(200).json(fleurs);
    }catch (err) {
        res.status(400).json({error: err});
    }
});

router.get('/:id', async (req, res) => {
    try{
        const fleur = await Locker.findById(req.params.id);
        res.status(200).json(fleur);
    }catch (err) {
        res.status(400).json({error: err});
    }
});

router.put('/:id', async (req, res) => {
    try{
        const updatedFleur = await Locker.findByIdAndUpdate
        (req.params.id, req.body, {new: true});
        res.status(200).json(updatedFleur);
    }catch (err) {
        res.status(400).json({error: err});
    }
});

router.delete('/:id', async (req, res) => {
        try{
            const deletedFleur = await Locker.findByIdAndDelete(req.params.id);
            res.status(200).json(deletedFleur);
        }catch (err) {
            res.status(400).json({error: err});
        }
    }
);
module.exports = router;