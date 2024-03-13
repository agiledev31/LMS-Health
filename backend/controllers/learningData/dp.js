const mongoose = require("mongoose");
const DPModel = require("../../models/learningData/DP");
const {
  Question,
  MultiChoice,
  TrueOrFalse,
  ShortAnswer,
} = require("../../models/learningData/Question");

module.exports = {
  create: async function (req, res) {
    const imageUrls = req.files.map((file) => file.path);

    let dp = JSON.parse(req.body.dp);
    const imageUrl = imageUrls[0];
    dp.imageUrl = imageUrl;

    const question_ids = [];
    let error;
    for (i = 0; i < dp.questions.length; i++) {
      let QuestionModel;
      let dp_question = dp.questions[i];
      dp_question.imageUrl = imageUrls[i + 1];
      switch (dp.questions[i].type) {
        case "MultiChoice":
          QuestionModel = MultiChoice;
          break;
        case "TrueOrFalse":
          QuestionModel = TrueOrFalse;
          break;
        case "ShortAnswer":
          QuestionModel = ShortAnswer;
          break;
        default:
          QuestionModel = Question;
      }
      await QuestionModel.create(dp_question)
        .then((newQuestion) => {
          question_ids.push(newQuestion._id);
        })
        .catch((err) => {
          error = err;
          // if (err.errors) {
          //   res
          //     .status(400)
          //     .json({ message: "Require data", errors: err.errors });
          // } else {
          //   res
          //     .status(500)
          //     .json({ message: "Internal server error", data: null });
          // }
        });
      console.log(error);
      if (error) break;
    }

    dp.questions = question_ids;
    await DPModel.create(dp)
      .then(function (result) {
        res.status(200).json({
          message: "DP added successfully!!!",
          data: result,
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
    let dps = await DPModel.find()
      .populate("matieres")
      .populate("items")
      .populate("tags")
      .populate("session_id");
    res.status(200).json({ message: null, data: dps });
  },
  getByIdWithQuestions: async function (req, res) {
    let dps = await DPModel.findById(req.params.id)
      .populate("matieres")
      .populate("items")
      .populate("tags")
      .populate("session_id")
      .populate("questions");
    res.status(200).json({ message: null, data: dps });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let dps = await DPModel.find(filter).populate("matieres").populate("items");
    res.status(200).json({ message: null, data: dps });
  },
  getPage: async function (req, res) {
    const {
      user_id,
      pageSize,
      pageNumber,
      searchText,
      session_id,
      filter,
      sort,
    } = req.body;
    console.log(session_id);
    const PAGE_SIZE = parseInt(pageSize);
    const PAGE_NUMBER = parseInt(pageNumber);
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const SORT_BY = { ...sort };
    const FILTER_BY = {
      desc: { $regex: searchText, $options: "i" },
    };
    if (session_id)
      FILTER_BY.session_id = new mongoose.Types.ObjectId(session_id);
    if (filter.matieres && filter.matieres.length > 0)
      FILTER_BY.matieres = {
        $in: filter.matieres.map((_id) => new mongoose.Types.ObjectId(_id)),
      };
    if (filter.items && filter.items.length > 0)
      FILTER_BY.items = {
        $in: filter.items.map((_id) => new mongoose.Types.ObjectId(_id)),
      };
    if (filter.tags && filter.tags.length > 0)
      FILTER_BY.tags = {
        $in: filter.tags.map((_id) => new mongoose.Types.ObjectId(_id)),
      };
    DPModel.aggregate([
      {
        $lookup: {
          from: "score_dps",
          let: { dpId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$dp_id", "$$dpId"] },
                  ],
                },
              },
            },
          ],
          as: "score",
        },
      },
      {
        $unwind: {
          path: "$score",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          last_assess: "$score.last_assess",
          user_score: "$score.user_score",
          total_score: "$score.total_score",
        },
      },
      {
        $project: {
          score: 0,
        },
      },
      {
        $facet: {
          data: [
            {
              $match: FILTER_BY,
            },
            {
              $lookup: {
                from: "matieres",
                localField: "matieres",
                foreignField: "_id",
                as: "matieres",
              },
            },
            {
              $sort: SORT_BY,
            },
            {
              $lookup: {
                from: "items",
                localField: "items",
                foreignField: "_id",
                as: "items",
              },
            },
            {
              $project: {
                matieres: {
                  image: 0,
                },
                items: {
                  objects: 0,
                },
              },
            },
            {
              $skip: (PAGE_NUMBER - 1) * PAGE_SIZE,
            },
            {
              $limit: PAGE_SIZE,
            },
          ],
          count: [
            {
              $match: FILTER_BY,
            },
            {
              $count: "total",
            },
          ],
        },
      },
    ])
      .then(function (result) {
        res.status(200).json({
          message: "DPs found successfully",
          data: result[0].data,
          total_number: result[0].count[0]?.total ?? 0,
        });
      })
      .catch(function (err) {
        console.log(err);
        res.status(400).json({ message: "DPs not found", data: null });
      });
  },
  getById: function (req, res) {
    DPModel.findById(req.params.id)
      .populate("questions")
      .then(function (dp) {
        res.status(200).json({ message: null, data: dp });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "DP not found", data: null });
      });
  },
  updateById: async function (req, res) {
    let dp = JSON.parse(req.body.dp);
    const imageUrls = req.files.map((file) => file.path);
    const imageUrl = imageUrls[0] || dp.imageUrl;
    dp.imageUrl = imageUrl;

    const question_ids = [];
    let error;
    for (i = 0; i < dp.questions.length; i++) {
      let QuestionModel;
      let dp_question = dp.questions[i];
      dp_question.imageUrl = imageUrls[i + 1] || dp_question.imageUrl;
      switch (dp.questions[i].type) {
        case "MultiChoice":
          QuestionModel = MultiChoice;
          break;
        case "TrueOrFalse":
          QuestionModel = TrueOrFalse;
          break;
        case "ShortAnswer":
          QuestionModel = ShortAnswer;
          break;
        default:
          QuestionModel = Question;
      }
      if (dp_question)
        await QuestionModel.findByIdAndUpdate(dp_question._id, dp_question)
          .then((updatedQuestion) => {
            question_ids.push(updatedQuestion._id);
          })
          .catch((err) => {
            error = err;
          });
      else
        await QuestionModel.create(dp.questions[i])
          .then((newQuestion) => {
            question_ids.push(newQuestion._id);
          })
          .catch((err) => {
            error = err;
          });
      if (error) break;
    }

    dp.questions = question_ids;
    DPModel.findByIdAndUpdate(req.params.id, dp)
      .then(function (dp) {
        res.status(200).json({ message: "DP updated successfully!", data: dp });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    DPModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "DP deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
