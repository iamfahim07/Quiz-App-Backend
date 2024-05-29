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
  timeRequired: {
    type: Number,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Number,
    required: true,
    trim: true,
  },
});

// leaderboard schema structure
const leaderboardSchema = new mongoose.Schema(
  {
    leaderboardName: {
      type: String,
      required: true,
      trim: true,
    },
    topScorer: {
      type: [topScorerSchema],
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// leaderboard model
const LeaderboardModel = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = LeaderboardModel;
