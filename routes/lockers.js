const express = require('express');
const jwt = require('../utils/jwt'); // Assuming you have a JWT middleware for authentication
const router = express.Router();
const booking = require('../controllers/bookingController'); // Assuming you have a booking controller
const lockerController = require('../controllers/lockerController');

router.post('/', lockerController.postLocker);

router.get('/list', lockerController.getLockers);

router.get('/:id', lockerController.getLockerById);

router.put('/:id', lockerController.updateLocker);

router.delete('/:id', lockerController.deleteLocker);

router.post('/create', lockerController.postLocker);

router.post('/reserve', (booking.postBooking));

module.exports = router;