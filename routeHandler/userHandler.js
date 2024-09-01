// external import
const express = require("express");

// internal import
const { UserController } = require("../controller/user.controller");

// router setup
const router = express.Router();

// check authentication status
router.get("/check-auth", UserController.checkAuth);

// login a user
router.post("/login", UserController.login);

// logout a user
router.post("/logout", UserController.logout);

// register new user
router.post("/register", UserController.register);

// get refresh token
router.post("/refresh-token", UserController.refreshToken);

module.exports = router;
