var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/authController");
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/", verifyToken, userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
