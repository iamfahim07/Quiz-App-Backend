// external import
const express = require("express");
const mongoose = require("mongoose");

// internal import
const quizSchema = require("../schema/quizSchema");

// router setup
const router = express.Router();

// get all the quiz
router.get("/:topic", async (req, res) => {
  try {
    const all_quizzes = await mongoose
      .model(`${req.params.topic}_quiz`, quizSchema)
      .find();

    if (all_quizzes.length > 0) {
      res.status(200).json({ data: all_quizzes });
    } else {
      res.status(409).json({
        message: "No quiz found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// post a quiz
router.post("/:topic", async (req, res) => {
  try {
    const data = {
      question: req.body.question,
      isMultiple: req.body.isMultiple,
      options: req.body.options,
    };

    const new_quiz = new mongoose.model(`${req.params.topic}_quiz`, quizSchema)(
      data
    );
    await new_quiz.save();

    res.status(200).json({
      data: new_quiz,
    });
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// update a quiz
// unused
router.put("/:topic", async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      img_link: req.img_link,
      img_ref: req.img_ref,
    };
    const id = req.body.id;
    const quiz = await mongoose
      .model(`${req.params.topic}_quiz`, quizSchema)
      .findByIdAndUpdate(
        id,
        {
          question: "Random 3",
        },
        { new: true }
      );

    res.status(200).json({
      data: quiz,
    });
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// delete a quiz
// unused
router.delete("/:topic/:id", async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      img_link: req.img_link,
      img_ref: req.img_ref,
    };

    // delete the document from MongoDB
    const deletedQuiz = await mongoose
      .model(`${req.params.topic}_quiz`, quizSchema)
      .findByIdAndDelete(req.params.id);

    res.status(200).json({
      data: deletedQuiz,
    });
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

module.exports = router;
