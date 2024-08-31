// external import
const createError = require("http-errors");

// 404 not found handler
function notFoundHandler(req, res, next) {
  next(createError(404, "Your requested url was not found!"));
}

// default error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next("There was a problem!");
  } else {
    if (err.message) {
      res.status(500).send(err.message);
    } else {
      res.send("There was an error!");
    }
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
