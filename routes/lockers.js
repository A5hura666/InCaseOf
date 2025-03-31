const express = require("express");
const router = express.Router();
const lockerController = require("../controllers/lockerController");

// Route pour afficher tous les casiers
router.get("/", lockerController.getAllLockers);

// Route pour afficher le formulaire de création de casier
// router.get("/create", lockerController.showCreateLockerForm);

// Route pour créer un nouveau casier
router.post("/", lockerController.createLocker);

// Route pour obtenir un casier par ID
router.get("/:id", lockerController.getLockerById);

// Route pour mettre à jour un casier
router.put("/:id", lockerController.updateLocker);

// Route pour supprimer un casier
router.delete("/:id", lockerController.deleteLocker);

module.exports = router;
