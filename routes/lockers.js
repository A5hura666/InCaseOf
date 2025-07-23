const express = require('express');
const jwt = require('../utils/jwt'); // Assuming you have a JWT middleware for authentication
const router = express.Router();
const booking = require('../controllers/bookingController'); // Assuming you have a booking controller
const lockerController = require('../controllers/lockerController');
const verifyToken = require("../middlewares/authController");

router.post('/', verifyToken, lockerController.postLocker);

router.get('/list', lockerController.getLockers);

router.get('/:id', verifyToken, lockerController.getLockerById);

router.put('/:id', verifyToken, lockerController.updateLocker);

router.delete('/:id', verifyToken, lockerController.deleteLocker);

router.post('/create', verifyToken, lockerController.postLocker);

module.exports = router;