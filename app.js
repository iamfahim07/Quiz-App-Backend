// external import
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// internal import
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const quizTopicHandler = require("./routeHandler/quizTopicHandler");

// express app initialization
const app = express();
app.use(cors());
app.use(express.json());

// config env file
dotenv.config();

// database connection with mongoose
mongoose
  .connect("mongodb://localhost/quizzes")
  .then(() => console.log("database connection successfull"))
  .catch((err) => console.log(err));

// routing setup
app.use("/topics", quizTopicHandler);

// 404 not found handling
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`server is on at port ${process.env.PORT}`)
);
