// internal import
const { UserService } = require("../services/user.serivce");

// checkAuth router callback function
const checkAuth = async (req, res) => {
  try {
    if (Object.keys(req.cookies).length === 0 || !req.cookies["accessToken"]) {
      return res.status(200).json({ data: {} });
    }

    const { accessToken, refreshToken } = req.cookies;

    const user = await UserService.checkAuth(accessToken);

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(401).json({ message: "Authentication error" });
  }
};

// login router callback function
const login = async (req, res) => {
  try {
    if (!req?.body?.username || !req?.body?.password) {
      return res
        .status(400)
        .json({ message: "Please provide user name and password" });
    }

    const { username, password } = req.body;

    const {
      user,
      tokens: { accessToken, refreshToken },
    } = await UserService.login(username, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: "Authentication error!" });
  }
};

// logout router callback function
const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Authentication error" });
  }
};

// register router callback function
const register = async (req, res) => {
  try {
    if (!req?.body?.fullName || !req?.body?.username || !req?.body?.password) {
      return res.status(400).json({
        message: "Please provide full name, user name and password!",
      });
    }

    const {
      user,
      tokens: { accessToken, refreshToken },
    } = await UserService.register(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ data: user });
  } catch (err) {
    res.status(500).json({
      message:
        "Sorry, that username is already taken. Please try a different one.",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    if (Object.keys(req.cookies).length === 0 || !req.cookies["refreshToken"]) {
      return res.status(200).json({ data: {} });
    }

    const { accessToken, refreshToken } = req.cookies;

    const {
      user,
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    } = await UserService.refreshToken(refreshToken);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ data: user });
  } catch (err) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(401).json({ message: "Authentication error!" });
  }
};

module.exports.UserController = {
  checkAuth,
  login,
  logout,
  register,
  refreshToken,
};
