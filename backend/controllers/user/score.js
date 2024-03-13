const {
  Question,
  MultiChoice,
  TrueOrFalse,
  ShortAnswer,
} = require("../../models/learningData/Question");
const Score_Question = require("../../models/userData/Score_Question");
const Score_Dp = require("../../models/userData/Score_DP");
const DPModel = require("../../models/learningData/DP");

const compareAndSetScore = function (question, user_answer) {
  let score,
    total_score = 20;
  if (user_answer) {
    switch (question.__t) {
      case "MultiChoice":
        const discordance = question.answers
          .map(({ answer }, id) => {
            if (!answer === user_answer[id]) {
              return 1;
            } else {
              return 0;
            }
          })
          .reduce((acc, curr) => acc + curr, 0);
        if (discordance === 0) {
          score = 20;
        } else if (discordance === 1) {
          score = 10;
        } else if (discordance === 2) {
          score = 4;
        } else {
          score = 0;
        }
        if (question.answers.length > 9)
          score = Math.round(
            (question.answers.filter(
              ({ answer }, i) => answer && user_answer[i]
            ).length *
              total_score) /
              question.answers.filter(({ answer }) => answer).length
          );
        break;
      case "TrueOrFalse":
        score = user_answer === question.answer ? 20 : 0;
        break;
      case "ShortAnswer":
        score = question.answers.includes(user_answer.trim()) ? 20 : 0;
        break;
      default:
        score = 0;
        break;
    }
  } else {
    score = 0;
  }
  return { score, total_score };
};

const Controller = {
  create: async function (req, res) {
    const item = req.body;
    await Score_Question.create(item)
      .then(function (result) {
        res.status(200).json({
          message: "Score was saved successfully!!!",
          data: { id: result._id },
        });
      })
      .catch(function (err) {
        if (err.errors) {
          res.status(400).json({ message: "Require data", errors: err.errors });
        } else {
          res
            .status(500)
            .json({ message: "Internal server error", data: null });
        }
      });
  },
  getAll: async function (req, res) {
    let progressData = await Score_Question.find();
    res.status(200).json({ message: null, data: progressData });
  },
  getOne: async function (req, res) {
    const { user_id, question_id } = req.body;
    let lastAccess = await Score_Question.findOne({ user_id, question_id });
    res.status(200).json({ message: null, data: lastAccess });
  },
  getDpOne: async function (req, res) {
    const { user_id, dp_id } = req.body;
    let lastAssess = await Score_Dp.findOne({ user_id, dp_id });
    res.status(200).json({ message: null, data: lastAssess });
  },
  checkDp: async function (req, res) {
    const user_id = req.body.user_id;
    const dp_id = req.body.dp_id;
    const user_answers = req.body.answers;
    const dp = await DPModel.findById(dp_id).populate("questions");
    const tempDp = JSON.parse(JSON.stringify(dp));
    let dp_total_score = 0;
    let dp_user_score = 0;
    for (let i = 0; i < dp.questions.length; i++) {
      let question = await Question.findById(dp.questions[i]._id).populate(
        "cards"
      );
      const { total_score, score } = compareAndSetScore(
        question,
        user_answers[i]
      );
      dp_total_score += total_score;
      question.total_score = total_score;
      dp_user_score += score;
      question.score = score;
      const lastAssess = await Score_Question.findOne({
        user_id,
        question_id: question._id,
      });

      const lastScore=lastAssess?.user_score;
      const lastAttempt = lastAssess?.last_assess;
  
      // If the last assessment exists, update the scores
      if (lastAssess) {
        lastAssess.user_score = score;
        // Save the updated assessment
        await lastAssess.save()
      } else {
        // Create a new assessment
        const newAssess = {
          user_id,
          matiere_id: question.matiere_id,
          item_id: question.item_id,
          dp_id: question.dp_id,
          question_id: question._id,
          user_score: score,
          total_score,
        };
  
        // Save the new assessment
        await Score_Question.create(newAssess)
      }

      tempDp.questions[i] = {
        ...JSON.parse(JSON.stringify(question)),
        total_score: total_score,
        user_score: score,
        userAnswer: user_answers[i],
        lastScore,
        lastAttempt,
      };
    }
    tempDp.dp_total_score = dp_total_score;
    tempDp.dp_user_score = dp_user_score;

    // Find the last assessment for the user and question
    await Score_Dp.findOneAndUpdate(
      {
        user_id,
        dp_id: dp._id,
      },
      {
        user_id,
        dp_id: dp_id,
        user_score: dp_user_score,
        total_score: dp_total_score,
      },
      {
        new: true,
        upsert: true,
      }
    )
      .then(function (result) {
        res.status(200).json({
          message: "Your answer was submitted successfully!",
          data: tempDp,
        });
      })
      .catch(function (err) {
        if (err.errors) {
          res.status(400).json({ message: "Require data", errors: err.errors });
        } else {
          res
            .status(500)
            .json({ message: "Internal server error", data: null });
        }
      });
  },
  checkAnswer: async function (req, res) {
    const user_id = req.body.user_id;
    const { question_id } = req.body.question;
    const user_answer = req.body.answer;
    let question = await Question.findById(question_id).populate("cards").populate("tags");
    // .populate("Matiere")
    // .populate("Item")
    // .populate("DP")
    // .exec();
    const { total_score, score } = compareAndSetScore(question, user_answer);
    // Find the last assessment for the user and question
    const lastAssess = await Score_Question.findOne({
      user_id,
      question_id: question._id,
    });
    const lastScore=lastAssess?.user_score;
    const lastAttempt = lastAssess?.last_assess;

    // If the last assessment exists, update the scores
    if (lastAssess) {
      lastAssess.user_score = score;
      // Save the updated assessment
      await lastAssess
        .save()
        .then(function (result) {
          res.status(200).json({
            message: "Your answer was submitted successfully!",
            data: { lastScore, lastAttempt, total_score, score, question },
          });
        })
        .catch(function (err) {
          console.log(err)
          if (err.errors) {
            res
              .status(400)
              .json({ message: "Require data", errors: err.errors });
          } else {
            res
              .status(500)
              .json({ message: "Internal server error1", data: null });
          }
        });
    } else {
      // Create a new assessment
      const newAssess = {
        user_id,
        matiere_id: question.matiere_id,
        item_id: question.item_id,
        dp_id: question.dp_id,
        question_id: question._id,
        user_score: score,
        total_score,
      };

      // Save the new assessment
      await Score_Question.create(newAssess)
        .then(function (result) {
          res.status(200).json({
            message: "Your answer was submitted successfully!",
            data: { lastScore, lastAttempt, total_score, score, question },
          });
        })
        .catch(function (err) {
          if (err.errors) {
            res
              .status(400)
              .json({ message: "Require data", errors: err.errors });
          } else {
            res
              .status(500)
              .json({ message: "Internal server error2", data: null });
          }
        });
    }
  },
};

module.exports = Controller;
