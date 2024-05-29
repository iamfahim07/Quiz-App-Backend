// external import
const express = require("express");

// internal import
const { UserController } = require("../controller/user.controller");

// router setup
const router = express.Router();

// login a user
router.post("/login", UserController.login);

// register a user info
// router.post("/register", async (req, res) => {
//   try {
//     const data = {
//       fullName: req.body.fullName,
//       userName: req.body.userName,
//       password: req.body.password,
//     };

//     const new_user = new userModel(data);
//     await new_user.save();

//     res.status(200).json({
//       message: "successfull",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "there was an error",
//     });
//   }
// });
router.post("/register", UserController.register);

// get refresh token
router.post("/refresh-token", UserController.refreshToken);

module.exports = router;
