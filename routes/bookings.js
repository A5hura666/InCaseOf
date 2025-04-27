const express = require("express");
const router = express.Router();
const Bookings = require("../models/Booking");
const {LockerManager} = require("../manager/LockerManager");

router.post("/", async (req, res) => {
  try {
    const lockerBooked = LockerManager.findLockerById(req.body.lockerId);
    if (lockerBooked && lockerBooked.lockerStatus === 1) {
      const newBookings = new Bookings(req.body);
      const registeredBookings = await newBookings.save();
      lockerBooked.lockerStatus = 0;
      lockerBooked.save();
      res.status(201).json(registeredBookings);
    } else {
      res.status(400).json({ error: "Locker not available" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const fleurs = await Bookings.find();
    res.status(200).json(fleurs);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const fleur = await Bookings.findById(req.params.id);
    res.status(200).json(fleur);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedBookings = await Bookings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedBookings);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedBookings = await Bookings.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedBookings);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});
module.exports = router;
