const createError = require("http-errors");

// 404 not found handler
function notFoundHandler(req, res, next) {
  next(createError(404, "Your request content was not found!"));
}

// default error handler
function errorHandler(err, req, res, next) {
  if (err) {
    res.status(500).send(err.message);
  } else {
    res.send("Success");
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
