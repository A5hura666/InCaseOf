const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.postUser);

router.get('/', userController.getUsers);

router.get('/:id/bookings', userController.getBookingsByUserId);

router.get('/:id', userController.getUserById);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;