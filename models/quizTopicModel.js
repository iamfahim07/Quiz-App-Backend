// external import
const mongoose = require("mongoose");

// top scorer schema structure
const topScorerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  obtainedScore: {
    type: Number,
    required: true,
    trim: true,
  },
  timeSpent: {
    type: Number,
    required: true,
    trim: true,
  },
  creationTime: {
    type: Number,
    required: true,
    trim: true,
  },
});

// quiz topic schema structure
const quizTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "Title cannot exceed 20 characters"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [230, "Description cannot exceed 230 characters"],
    },
    img_link: {
      type: String,
      required: true,
      trim: true,
    },
    img_ref: {
      type: String,
      required: true,
      trim: true,
    },
    leaderboard: [topScorerSchema],
  },
  { timestamps: true }
);

//  quiz topic model
const QuizTopicModel = mongoose.model("Topic", quizTopicSchema);

module.exports = QuizTopicModel;
