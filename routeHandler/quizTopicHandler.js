// external import
const express = require("express");

// internal import
const fileUploads = require("../middlewares/common/fileUploads");
const QuizModel = require("../models/quizModel");

// router setup
const router = express.Router();

// post a quiz topic
router.post("/", fileUploads, async (req, res) => {
  try {
    const data = { title: req.body.title, imgLink: req.imgLink };
    const newQuiz = new QuizModel(data);
    await newQuiz.save();

    // console.log(req.body);

    res.status(200).json({
      message: "successfull",
    });
  } catch (err) {
    res.status(500).json({
      message: "there was a error",
    });
  }
});

module.exports = router;
