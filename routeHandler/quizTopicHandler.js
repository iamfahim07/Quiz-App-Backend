// external import
const express = require("express");

// internal import
const topicDataValidator = require("../middlewares/topicDataValidator");
const QuizTopicModel = require("../models/quizTopicModel");
const firebaseFileUpload = require("../lib/firebaseFileUpload");
const firebaseFileDelete = require("../lib/firebaseFileDelete");
const QuizModel = require("../models/quizModel");
const LeaderboardModel = require("../models/leaderboardModel");
const removeExtraSpaces = require("../utilities/removeExtraSpaces");

// router setup
const router = express.Router();

// get all the quiz topic
router.get("/", async (req, res) => {
  try {
    const topics = await QuizTopicModel.find().select({
      title: 1,
      description: 1,
      img_link: 1,
      img_ref: 1,
    });

    if (topics.length > 0) {
      res.status(200).json({ data: topics });
    } else {
      res.status(409).json({
        message: "No quiz topic found...",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// post a quiz topic
router.post("/", topicDataValidator, async (req, res) => {
  try {
    // checking if the topic already exist or not
    const regexParamsValue = new RegExp(
      `^${removeExtraSpaces(req.body.title)}$`,
      "i"
    );
    const isTopicExist = await QuizTopicModel.findOne({
      title: regexParamsValue,
    });

    if (isTopicExist) {
      return res.status(409).json({
        message:
          "This quiz topic name is already exist! Try another topic name.",
      });
    }

    // checking if an image file exist or not
    if (!req.body.img_object || !req.body.img_ref) {
      return res.status(409).json({
        message: "No image file exist. please upload one",
      });
    }

    const img_link = await firebaseFileUpload(
      req.body.img_object,
      req.body.img_ref
    );

    const data = {
      title: removeExtraSpaces(req.body.title),
      description: removeExtraSpaces(req.body.description),
      img_link: img_link,
      img_ref: req.body.img_ref,
    };
    const newQuizTopic = new QuizTopicModel(data);
    await newQuizTopic.save();

    // creating a quiz database document for the newly added topic
    const new_quiz_data = {
      relatedTopicId: newQuizTopic.id,
      questionVault: [],
    };

    const new_quiz = new QuizModel(new_quiz_data);
    await new_quiz.save();

    // creating a leaderboard database document for the newly added topic
    const new_leaderboard_data = {
      relatedTopicId: newQuizTopic.id,
      topScorer: [],
    };

    const new_leaderboard = new LeaderboardModel(new_leaderboard_data);
    await new_leaderboard.save();

    // sending response
    res.status(200).json({
      data: newQuizTopic,
    });
  } catch (err) {
    // delete image from firebase
    if (req.body.img_ref) {
      await firebaseFileDelete(req.body.img_ref);
    }

    res.status(500).json({
      message: "there was an error",
    });
  }
});

// update a quiz topic
router.put("/", topicDataValidator, async (req, res) => {
  try {
    // checking if the topic already exist or not
    const isTopicExist = await QuizTopicModel.findOne({
      _id: req.body.id,
    });

    if (!isTopicExist) {
      return res.status(409).json({
        message: "Invalid ID. Can't find the corresponding topic.",
      });
    }

    // extracting all relevant data from the request
    let data = {
      title: removeExtraSpaces(req.body.title),
      description: removeExtraSpaces(req.body.description),
    };

    const regexParamsValue = new RegExp(
      `^${removeExtraSpaces(data.title)}$`,
      "i"
    );

    // checking if the topic name already taken or not
    const isTopicNameTaken = await QuizTopicModel.findOne({
      title: regexParamsValue,
    });

    if (
      isTopicExist.title.toLowerCase() !== data.title.toLowerCase() &&
      isTopicNameTaken
    ) {
      return res.status(409).json({
        message:
          "This quiz topic name is already exist! Try another topic name.",
      });
    }

    // delete the existing image file if the user wants to update the image with a new image
    if (req.body.img_object && req.body.img_ref) {
      // delete the existing image file
      await firebaseFileDelete(isTopicExist.img_ref);

      // upload the new image
      const new_img_link = await firebaseFileUpload(
        req.body.img_object,
        req.body.img_ref
      );

      data = {
        ...data,
        img_link: new_img_link,
        img_ref: req.body.img_ref,
      };
    } else {
      data = {
        ...data,
        img_link: isTopicExist.img_link,
        img_ref: isTopicExist.img_ref,
      };
    }

    const topic = await QuizTopicModel.findByIdAndUpdate(
      req.body.id,
      {
        ...data,
      },
      { returnDocument: "after" }
    );

    res.status(200).json({
      data: topic,
    });
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// delete a quiz topic
router.delete("/", async (req, res) => {
  try {
    const data = {
      id: req.body.payload,
    };

    if (data.id) {
      // delete the document from MongoDB
      const { img_ref } = await QuizTopicModel.findByIdAndDelete(
        data.id
      ).select({
        img_ref: 1,
        _id: 0,
      });

      // delete image from firebase
      await firebaseFileDelete(img_ref);

      // delete related quiz document
      await QuizModel.deleteOne({ relatedTopicId: data.id });

      // delete related leaderboard document
      await LeaderboardModel.deleteOne({ relatedTopicId: data.id });

      res.status(200).json({
        data: data.id,
      });
    } else {
      res.status(409).json({
        message: "Invalid id",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

module.exports = router;
