// In-memory lock
let isLocked = false;

// Lock middleware
function lockMiddleware(req, res, next) {
  if (isLocked) {
    return res.status(429).send("Too Many Requests - Try again later.");
  }
  isLocked = true;
  res.on("finish", () => {
    isLocked = false;
  });
  next();
}

module.exports = lockMiddleware;
