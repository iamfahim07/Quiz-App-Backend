// external import
const mongoose = require("mongoose");

// schema structure
const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imgLink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// quizzes model
const QuizModel = new mongoose.model("Topic", quizSchema);

module.exports = QuizModel;
