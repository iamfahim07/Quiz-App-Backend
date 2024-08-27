// external import
const express = require("express");
const mongoose = require("mongoose");

// internal import
// const quizSchema = require("../schema/quizSchema");
const QuizModel = require("../models/quizModel");
const QuizTopicModel = require("../models/quizTopicModel");
const removeExtraSpaces = require("../utilities/removeExtraSpaces");

// router setup
const router = express.Router();

// get all the quiz
router.get("/:topicId", async (req, res) => {
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

    // const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const quiz = await QuizModel.findOne({
      relatedTopicId: req.params.topicId,
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
router.post("/:topicId", async (req, res) => {
  try {
    // checking if the topic exist or not
    // const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const paramsValue = req.params.topicId;
    const isTopicExist = await QuizTopicModel.findById(paramsValue);

    // checking if the quiz already exist or not
    const isQuizExist = await QuizModel.findOne({
      relatedTopicId: paramsValue,
    });

    // data to save
    // const data = {
    //   relatedTopicId: isTopicExist?.title,

    //   questionVault: req.body.questionVault,
    // };

    // data to save
    const received_data = {
      question: removeExtraSpaces(req.body.payload.question),
      isMultiple: req.body.payload.isMultiple,
      options: [
        {
          value: removeExtraSpaces(req.body.payload.options[0].value),
          isCorrect: req.body.payload.options[0].isCorrect,
        },
        {
          value: removeExtraSpaces(req.body.payload.options[1].value),
          isCorrect: req.body.payload.options[1].isCorrect,
        },
        {
          value: removeExtraSpaces(req.body.payload.options[2].value),
          isCorrect: req.body.payload.options[2].isCorrect,
        },
        {
          value: removeExtraSpaces(req.body.payload.options[3].value),
          isCorrect: req.body.payload.options[3].isCorrect,
        },
      ],
    };

    if (isTopicExist && !isQuizExist && received_data) {
      const new_quiz_data = {
        relatedTopicId: isTopicExist.id,
        questionVault: [received_data],
      };

      const new_quiz = new QuizModel(new_quiz_data);
      await new_quiz.save();

      res.status(200).json({
        data: new_quiz.questionVault,
      });
    } else if (
      isTopicExist?.title &&
      isQuizExist?.relatedTopicId &&
      received_data
    ) {
      const updated_quiz = await QuizModel.findOneAndUpdate(
        { relatedTopicId: paramsValue },
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
router.put("/:topicId", async (req, res) => {
  try {
    // checking if the topic exist or not
    // const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const paramsValue = req.params.topicId;
    const isTopicExist = await QuizTopicModel.findById(paramsValue);

    // checking if the quiz already exist or not
    const isQuizExist = await QuizModel.findOne({
      relatedTopicId: paramsValue,
    });

    // data to save
    const received_data = {
      id: req.body.payload.id,
      quizData: {
        question: removeExtraSpaces(req.body.payload.quizData.question),
        isMultiple: req.body.payload.quizData.isMultiple,
        options: [
          {
            value: removeExtraSpaces(
              req.body.payload.quizData.options[0].value
            ),
            isCorrect: req.body.payload.quizData.options[0].isCorrect,
          },
          {
            value: removeExtraSpaces(
              req.body.payload.quizData.options[1].value
            ),
            isCorrect: req.body.payload.quizData.options[1].isCorrect,
          },
          {
            value: removeExtraSpaces(
              req.body.payload.quizData.options[2].value
            ),
            isCorrect: req.body.payload.quizData.options[2].isCorrect,
          },
          {
            value: removeExtraSpaces(
              req.body.payload.quizData.options[3].value
            ),
            isCorrect: req.body.payload.quizData.options[3].isCorrect,
          },
        ],
      },
    };

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
        { relatedTopicId: paramsValue },
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
router.delete("/:topicId", async (req, res) => {
  try {
    // checking if the quiz already exist or not
    // const regexParamsValue = new RegExp(`^${req.params.topic}$`, "i");
    const paramsValue = req.params.topicId;
    const isQuizExist = await QuizModel.findOne({
      relatedTopicId: paramsValue,
    });

    // id to received
    const received_id = req.body.payload;

    if (isQuizExist && received_id) {
      const updatedValueAfterDeletion = isQuizExist.questionVault.filter(
        (qn) => qn.id !== received_id
      );

      const updated_quiz_after_deletion = await QuizModel.findOneAndUpdate(
        { relatedTopicId: paramsValue },
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