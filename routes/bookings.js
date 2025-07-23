const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middlewares/authController");
const {restrictTo} = require("../utils/jwt");

router.post("/", verifyToken, bookingController.postBooking);

router.get("/", verifyToken, restrictTo('Admin'), bookingController.getBookings);

router.get("/:id", verifyToken, bookingController.getBookingById);

router.put("/:id", verifyToken, bookingController.updateBooking);

router.delete("/:id", verifyToken, bookingController.deleteBooking);

router.get("/:id/invoice", verifyToken, bookingController.getBookingInvoice);

module.exports = router;
