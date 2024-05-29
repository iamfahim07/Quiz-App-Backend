// external import
const express = require("express");
const mongoose = require("mongoose");

// internal import
const LeaderboardModel = require("../models/leaderboardModel");
// const lockMiddleware = require("../middlewares/lockMiddleware");

// router setup
const router = express.Router();

// get all the top scorers
router.get("/:leaderboard_name", async (req, res) => {
  try {
    const paramsName = req.params.leaderboard_name;

    const leaderboard = await LeaderboardModel.findOne({
      leaderboardName: paramsName,
    });

    if (leaderboard?.leaderboardName === paramsName) {
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
router.post("/:leaderboard_name", async (req, res) => {
  try {
    const paramsName = req.params.leaderboard_name;

    const leaderboard = await LeaderboardModel.findOne({
      leaderboardName: paramsName,
    });

    let data = {
      // leaderboardName: paramsName,
      topScorer: req.body.payload,
    };

    if (
      (leaderboard === null || !leaderboard?.leaderboardName === paramsName) &&
      data?.topScorer?.length > 0
    ) {
      data.leaderboardName = paramsName;

      const new_top_scorer = new LeaderboardModel(data);
      await new_top_scorer.save();

      res.status(200).json({ data: new_top_scorer });
    } else if (
      leaderboard?.leaderboardName === paramsName &&
      data?.topScorer?.length > 0 &&
      data?.topScorer?.length <= 7
    ) {
      const updated_data = await LeaderboardModel.findOneAndUpdate(
        {
          leaderboardName: paramsName,
        },
        { topScorer: data.topScorer },
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

// update top scorers
// unused
router.put("/:leaderboard_name", async (req, res) => {
  // try {
  //   const paramsName = req.params.leaderboard_name;
  //   const leaderboard = await LeaderboardModel.findOne({
  //     leaderboardName: paramsName,
  //   });
  //   const data = [...req.body.topScorer];
  //   if (leaderboard?.leaderboardName === paramsName && data?.length) {
  //     const updated_data = await LeaderboardModel.findOneAndUpdate(
  //       {
  //         leaderboardName: paramsName,
  //       },
  //       { topScorer: data },
  //       { returnDocument: "after" }
  //     );
  //     res.status(200).json({
  //       data: updated_data,
  //     });
  //   } else {
  //     res.status(409).json({
  //       message: "No Leaderboard exist by this name",
  //     });
  //   }
  // } catch (err) {
  //   res.status(500).json({
  //     message: "there was an error",
  //   });
  // }
});

// delete leaderboard data
// unused
router.delete("/:topic/:id", async (req, res) => {
  // try {
  //   const data = {
  //     title: req.body.title,
  //     img_link: req.img_link,
  //     img_ref: req.img_ref,
  //   };
  // delete the document from MongoDB
  //   const deletedQuiz = await mongoose
  //     .model(`${req.params.topic}_quiz`, quizSchema)
  //     .findByIdAndDelete(req.params.id);
  //   res.status(200).json({
  //     data: deletedQuiz,
  //   });
  // } catch (err) {
  //   res.status(500).json({
  //     message: "there was an error",
  //   });
  // }
});

module.exports = router;
