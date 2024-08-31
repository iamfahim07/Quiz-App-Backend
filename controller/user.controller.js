// internal import
const { UserService } = require("../services/user.serivce");

const login = async (req, res) => {
  try {
    if (!req?.body?.userName || !req?.body?.password) {
      return res
        .status(400)
        .json({ message: "Please provide user name and password" });
    }

    const { userName, password } = req.body;

    const result = await UserService.login(userName, password);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Authentication error" });
  }
};

const register = async (req, res) => {
  try {
    if (!req?.body?.fullName || !req?.body?.userName || !req?.body?.password) {
      return res.status(400).json({
        message: "Please provide full name, user name and password,",
      });
    }

    const result = await UserService.register(req.body);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({ message: "Please provide refreshToken" });
    }

    const result = await UserService.refreshToken(refreshToken);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Authentication error" });
  }
};

module.exports.UserController = { login, register, refreshToken };
