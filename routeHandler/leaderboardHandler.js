// external import
const express = require("express");
const mongoose = require("mongoose");

// internal import
const LeaderboardModel = require("../models/leaderboardModel");
const QuizTopicModel = require("../models/quizTopicModel");

// router setup
const router = express.Router();

// get all the top scorers
router.get("/:leaderboard_id", async (req, res) => {
  try {
    const paramsValue = req.params.leaderboard_id;

    const leaderboard = await LeaderboardModel.findOne({
      relatedTopicId: paramsValue,
    });

    if (leaderboard?.relatedTopicId === paramsValue) {
      res.status(200).json({ data: leaderboard });
    } else {
      res.status(409).json({
        message:
          "No leaderboard exists under this name. Be the first to join by playing this topic quiz.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// post new leaderboard
router.post("/:leaderboard_id", async (req, res) => {
  try {
    // checking if the topic exist or not
    const paramsValue = req.params.leaderboard_id;
    const isTopicExist = await QuizTopicModel.findById(paramsValue);

    const leaderboard = await LeaderboardModel.findOne({
      relatedTopicId: paramsValue,
    });

    const playerQuizResult = req.body.payload;

    if (
      (leaderboard === null || !leaderboard?.relatedTopicId === paramsValue) &&
      playerQuizResult.username
    ) {
      const data = {
        relatedTopicId: isTopicExist.id,
        topScorer: [playerQuizResult],
      };

      const new_top_scorer = new LeaderboardModel(data);
      await new_top_scorer.save();

      res.status(200).json({ data: new_top_scorer });
    } else if (
      leaderboard?.relatedTopicId === isTopicExist?.id &&
      playerQuizResult?.username
    ) {
      // analyse if the player made it into the top seven
      const topSeven = [...leaderboard.topScorer, playerQuizResult]
        .sort((a, b) => {
          if (a.obtainedScore !== b.obtainedScore) {
            return b.obtainedScore - a.obtainedScore;
          } else if (a.timeSpent !== b.timeSpent) {
            return a.timeSpent - b.timeSpent;
          }
          return a.creationTime - b.creationTime;
        })
        .slice(0, 7);

      const updated_data = await LeaderboardModel.findOneAndUpdate(
        {
          relatedTopicId: leaderboard.relatedTopicId,
        },
        { topScorer: topSeven },
        { returnDocument: "after" }
      );

      res.status(200).json({ data: updated_data });
    } else {
      res.status(409).json({
        message: "Invalid Leaderboard data",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

module.exports = router;
