// external import
const express = require("express");
const mongoose = require("mongoose");

// internal import
// const quizSchema = require("../schema/quizSchema");
const QuizModel = require("../models/quizModel");
const QuizTopicModel = require("../models/quizTopicModel");

// router setup
const router = express.Router();

// get all the quiz
router.get("/:topic", async (req, res) => {
  // try {
  //   const all_quizzes = await mongoose
  //     .model(`${req.params.topic}_quiz`, quizSchema)
  //     .find();

  //   if (all_quizzes.length > 0) {
  //     res.status(200).json({ data: all_quizzes });
  //   } else {
  //     res.status(409).json({
  //       message: "No quiz found",
  //     });
  //   }
  // } catch (err) {
  //   res.status(500).json({
  //     message: "there was an error",
  //   });
  // }

  try {
    // const paramsValue = req.params.topic;

    const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const quiz = await QuizModel.findOne({
      relatedTopicName: regexParamsValue,
    });

    if (quiz) {
      res.status(200).json({ data: quiz.questionVault });
    } else {
      res.status(409).json({
        message: "No quiz exists under this topic name.",
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
    // checking if the topic exist or not
    const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const isTopicExist = await QuizTopicModel.findOne({
      title: regexParamsValue,
    });

    // checking if the quiz already exist or not
    const isQuizExist = await QuizModel.findOne({
      relatedTopicName: regexParamsValue,
    });

    // data to save
    // const data = {
    //   relatedTopicName: isTopicExist?.title,

    //   questionVault: req.body.questionVault,
    // };

    // data to save
    const received_data = req.body.payload;

    if (isTopicExist && !isQuizExist && received_data) {
      const new_quiz_data = {
        relatedTopicName: isTopicExist.title,
        questionVault: [received_data],
      };

      const new_quiz = new QuizModel(new_quiz_data);
      await new_quiz.save();

      res.status(200).json({
        data: new_quiz.questionVault,
      });
    } else if (
      isTopicExist?.title &&
      isQuizExist?.relatedTopicName &&
      received_data
    ) {
      const updated_quiz = await QuizModel.findOneAndUpdate(
        { relatedTopicName: regexParamsValue },
        { questionVault: [...isQuizExist.questionVault, received_data] },
        { returnDocument: "after" }
      );

      res.status(200).json({
        data: updated_quiz.questionVault,
      });
    } else {
      res.status(409).json({
        message: "There is no topic name or data provided by the user.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// update a quiz
router.put("/:topic", async (req, res) => {
  try {
    // checking if the topic exist or not
    const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const isTopicExist = await QuizTopicModel.findOne({
      title: regexParamsValue,
    });

    // checking if the quiz already exist or not
    const isQuizExist = await QuizModel.findOne({
      relatedTopicName: regexParamsValue,
    });

    // data to save
    const received_data = req.body.payload;

    if (isTopicExist && isQuizExist && received_data) {
      const new_questionVault_value = isQuizExist.questionVault.map((qn) => {
        if (qn._id.toString() === received_data.id) {
          let updated_data = {
            question: received_data.quizData.question,
            isMultiple: received_data.quizData.isMultiple,
            options: [...received_data.quizData.options],
          };

          return updated_data;
        } else {
          return qn;
        }
      });

      const updated_quiz_optionAndValue = await QuizModel.findOneAndUpdate(
        { relatedTopicName: regexParamsValue },
        { questionVault: new_questionVault_value },
        { returnDocument: "after" }
      );

      res.status(200).json({
        data: updated_quiz_optionAndValue.questionVault,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

// delete a quiz
router.delete("/:topic", async (req, res) => {
  try {
    // checking if the quiz already exist or not
    const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const isQuizExist = await QuizModel.findOne({
      relatedTopicName: regexParamsValue,
    });

    // id to received
    const received_id = req.body.payload;

    if (isQuizExist && received_id) {
      const updatedValueAfterDeletion = isQuizExist.questionVault.filter(
        (qn) => qn.id !== received_id
      );

      const updated_quiz_after_deletion = await QuizModel.findOneAndUpdate(
        { relatedTopicName: regexParamsValue },
        { questionVault: [...updatedValueAfterDeletion] },
        { returnDocument: "after" }
      );

      res.status(200).json({ data: received_id });
    } else {
      res.status(409).json({
        message: "Invalid id or quiz",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "there was an error",
    });
  }
});

module.exports = router;
