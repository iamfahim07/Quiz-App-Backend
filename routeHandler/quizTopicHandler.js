// external import
const express = require("express");

// internal import
const topicDataValidator = require("../middlewares/topicDataValidator");
const QuizTopicModel = require("../models/quizTopicModel");
const firebaseFileUpload = require("../lib/firebaseFileUpload");
const firebaseFileDelete = require("../lib/firebaseFileDelete");

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
        message: "No topic found",
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
    const img_link = await firebaseFileUpload(
      req.body.img_object,
      req.body.img_ref
    );

    const data = {
      title: req.body.title,
      description: req.body.description,
      img_link: img_link,
      img_ref: req.body.img_ref,
    };
    const newQuizTopic = new QuizTopicModel(data);
    await newQuizTopic.save();

    res.status(200).json({
      data: newQuizTopic,
    });
  } catch (err) {
    // delete image from firebase
    firebaseFileDelete(req.body.img_ref);

    res.status(500).json({
      message: "there was an error",
    });
  }
});

// update a quiz topic
// unused
router.put("/:id", topicDataValidator, async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      img_link: req.body.img_link,
      img_ref: req.body.img_ref,
    };
    const topic = await QuizTopicModel.findByIdAndUpdate(
      req.params.id,
      {
        title: "Random 9",
      },
      { new: true }
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
// unused
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
      firebaseFileDelete(img_ref);

      res.status(200).json({
        data: img_ref,
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
