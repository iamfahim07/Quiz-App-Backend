// external import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal import
const userModel = require("../models/userModel");
const getNewTokens = require("../utilities/getNewTokens");

const checkAuth = async (accessToken) => {
  const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);

  const user = {
    fullName: decoded.fullName,
    userName: decoded.userName,
    role: decoded.role,
  };

  return user;
};

const login = async (userName, password) => {
  const user = (await userModel.findOne({ userName })) || {};

  if (!user?.userName) {
    throw new Error("User not found or Invalid password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user?.password);

  if (!isPasswordCorrect) {
    throw new Error("User not found or Invalid password");
  }

  const userData = {
    fullName: user.fullName,
    userName: user.userName,
    role: user.role,
  };

  const tokens = getNewTokens(userData);

  return {
    user: userData,
    tokens,
  };
};

const register = async (reqBody) => {
  const { fullName, userName, password } = reqBody;

  const user = (await userModel.findOne({ userName })) || {};

  if (user?.userName) {
    throw new Error("User name already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserInfoData = {
    fullName,
    userName,
    password: hashedPassword,
  };

  const newUserInfo = new userModel(newUserInfoData);
  const newUser = await newUserInfo.save();

  const newUserData = {
    fullName: newUser.fullName,
    userName: newUser.userName,
    role: newUser.role,
  };

  const tokens = getNewTokens(newUserData);

  return {
    user: newUserData,
    tokens,
  };
};

const refreshToken = async (refreshToken) => {
  // check if refresh token valid
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

  const user = {
    fullName: decoded.fullName,
    userName: decoded.userName,
    role: decoded.role,
  };

  const tokens = getNewTokens(user);

  return { user, tokens };
};

module.exports.UserService = {
  checkAuth,
  login,
  register,
  refreshToken,
};
