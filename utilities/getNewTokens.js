// external import
const jwt = require("jsonwebtoken");

/**
 * Generates new access and refresh tokens for a user.
 * @param {Object} user - The user object.
 * @param {string} user.userName - The user name.
 * @returns {Object} - An object containing the generated token and refresh token.
 */
const getNewTokens = (user) => {
  const token = jwt.sign(
    { userName: user.userName, type: "access" },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  const refreshToken = jwt.sign(
    { userName: user.userName, type: "refresh" },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
    }
  );

  return { token, refreshToken };
};

module.exports = getNewTokens;
