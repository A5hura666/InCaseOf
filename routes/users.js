var express = require('express');
var router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try{
    const newUser = new User(req.body);
    const registeredUser = await newUser.save();
    res.status(200).json(registeredUser);
  }catch (err) {
    res.status(400).json({error: err});
  }
});

router.get('/', async (req, res) => {
  try{
    const users = await User.find();
    res.status(200).json(users);
  }catch (err) {
    res.status(400).json({error: err});
  }
});

router.get('/:id', async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  }catch (err) {
    res.status(400).json({error: err});
  }
});

router.put('/:id', async (req, res) => {
  try{
    const updatedUser = await User.findByIdAndUpdate
    (req.params.id, req.body, {new: true});
    res.status(200).json(updatedUser);
  }catch (err) {
    res.status(400).json({error: err});
  }
});

router.delete('/:id', async (req, res) => {
      try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedUser);
      }catch (err) {
        res.status(400).json({error: err});
      }
    }
);
module.exports = router;




module.exports = router;
