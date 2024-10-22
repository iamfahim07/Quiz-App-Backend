// external import
const jwt = require("jsonwebtoken");

// internal import
const getNewTokens = require("../utilities/getNewTokens");

const checkLogin = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);

    const user = {
      fullName: decoded.fullName,
      userName: decoded.userName,
      role: decoded.role,
    };

    const requestMethod = req.method;

    if (
      requestMethod === "POST" ||
      requestMethod === "PUT" ||
      requestMethod === "DELETE"
    ) {
      if (user.role === "admin") {
        return next(); // Only proceed if user is admin
      } else {
        return res.status(403).json({ message: "Authorization error" });
      }
    }

    next();
  } catch {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

      const user = {
        fullName: decoded.fullName,
        userName: decoded.userName,
        role: decoded.role,
      };

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        getNewTokens(user);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: false,
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: false,
      });

      const requestMethod = req.method;

      if (
        requestMethod === "POST" ||
        requestMethod === "PUT" ||
        requestMethod === "DELETE"
      ) {
        if (user.role === "admin") {
          return next(); // Only proceed if user is admin
        } else {
          return res.status(403).json({ message: "Authorization error" });
        }
      }

      next();
    } catch {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Authentication error" });
    }
  }
};

module.exports = checkLogin;
