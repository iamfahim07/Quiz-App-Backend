// external import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal import
const userModel = require("../models/userModel");
const getNewTokens = require("../utilities/getNewTokens");

const login = async (userName, password) => {
  const [user] =
    (await userModel.find({ userName }).select({
      fullName: 1,
      userName: 1,
      password: 1,
      role: 1,
    })) || [];

  if (!user?.userName) {
    throw new Error("User not found or Invalid password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user?.password);

  if (!isPasswordCorrect) {
    throw new Error("User not found or Invalid password");
  }

  const tokens = getNewTokens(user._doc);

  let userObj = Object.assign({}, user._doc);
  delete userObj.password;

  return {
    user: userObj,
    tokens,
  };
};

const register = async (reqBody) => {
  const { fullName, userName, password } = reqBody;

  const [user] = await userModel.find({ userName });

  if (user?.userName) {
    throw new Error("User name already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserInfo = {
    fullName,
    userName,
    password: hashedPassword,
  };

  const newUser = new userModel(newUserInfo);
  await newUser.save();

  const tokens = getNewTokens(newUserInfo);

  delete newUserInfo.password;

  return {
    user: newUserInfo,
    tokens,
  };
};

const refreshToken = async (refreshToken) => {
  // check if refresh token valid
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

  if (!decoded) {
    throw new Error("Invalid refresh token");
  }

  // check if user exists
  const [user] = await userModel.find({ userName: decoded.userName });

  if (!user?.userName) {
    throw new Error("User not found");
  }

  const tokens = getNewTokens(user._doc);

  return tokens;
};

module.exports.UserService = {
  login,
  register,
  refreshToken,
};
