const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require("../middlewares/authController");

router.post('/', verifyToken, userController.postUser);

router.get('/', verifyToken, userController.getUsers);

router.get('/:id/bookings', verifyToken, userController.getBookingsByUserId);

router.get('/:id', verifyToken, userController.getUserById);

router.put('/:id', verifyToken, userController.updateUser);

router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;