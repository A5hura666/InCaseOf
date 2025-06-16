const express = require('express');
const router = express.Router();
const lockerController = require('../controllers/lockerController');

router.post('/', lockerController.postLocker);

router.get('/', lockerController.getLockers);

router.get('/:id', lockerController.getLockerById);

router.put('/:id', lockerController.updateLocker);

router.delete('/:id', lockerController.deleteLocker);

module.exports = router;