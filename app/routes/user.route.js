const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const userRequest = require("../requests/user.request");

router.post("/register", userRequest.validateInput("register"), userController.register);
router.post("/login", userRequest.validateInput("login"), userController.login);

module.exports = router;