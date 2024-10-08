// external import
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// internal import
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const quizTopicHandler = require("./routeHandler/quizTopicHandler");
const quizHandler = require("./routeHandler/quizHandler");
const userHandler = require("./routeHandler/userHandler");
const leaderboardHandler = require("./routeHandler/leaderboardHandler");
const checkLogin = require("./middlewares/checkLogin");

// express app initialization
const app = express();

// cross-origin resource sharing middleware
app.use(
  cors({
    origin: `${process.env.ORIGIN_URL}`,
    credentials: true,
  })
);

// json parser middleware
app.use(express.json());

// cookie parser
app.use(cookieParser());

// config env file
dotenv.config();

// database connection with mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("database connection successfull"))
  .catch((err) => console.log(err));

// routing setup
app.get("/error", (req, res, next) => {
  throw new Error("Something went wrong!");
});

app.use("/topics", checkLogin, quizTopicHandler);

app.use("/quizzes", checkLogin, quizHandler);

app.use("/user", userHandler);

app.use("/leaderboards", leaderboardHandler);

// 404 not found handling
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

// listening for connections on the specified host and port
app.listen(process.env.PORT, () =>
  console.log(`server is on at port ${process.env.PORT}`)
);
