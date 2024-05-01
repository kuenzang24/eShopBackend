const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.get("/", userController.getAllUser);
router.get("/count", userController.getUserCount);
router.get("/:userId", userController.getUser);
router.post("/login", userController.login);
router.delete("/:userId", userController.deleteUser);

module.exports = router;