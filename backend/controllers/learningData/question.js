const mongoose = require("mongoose");
const {
  Question,
  MultiChoice,
  TrueOrFalse,
  ShortAnswer,
} = require("../../models/learningData/Question");

const { upload } = require("../../config/multer_config");

module.exports = {
  create: async function (req, res) {
    const imageUrl = req.file.path;
    let question = JSON.parse(req.body.question);
    question.imageUrl = imageUrl;

    const type = req.body.type;
    let QuestionModel;
    switch (type) {
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
    await QuestionModel.create(question)
      .then(function (result) {
        res.status(200).json({
          message: "Question added successfully!!!",
          data: result,
        });
      })
      .catch(function (err) {
        console.log(err);
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
    let questions = await Question.find({
      $or: [
        { matiere_id: { $exists: true } },
        { session_id: { $exists: true } },
      ],
    }).select("-answers");
    res.status(200).json({ message: null, data: questions });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    if (filter.type) {
      filter["__t"] = filter.type;
      delete filter.type;
    }
    let questions = await Question.find(filter);
    res.status(200).json({ message: null, data: questions });
  },
  getById: function (req, res) {
    Question.findById(req.params.id)
      .then(function (question) {
        res.status(200).json({ message: null, data: question });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Question not found", data: null });
      });
  },
  updateById: function (req, res) {
    const question = JSON.parse(req.body.question);
    const imageUrl = req.file.path || question.imageUrl;
    const type = req.body.type;
    question.imageUrl = imageUrl;

    let QuestionModel;
    switch (type) {
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
    QuestionModel.findByIdAndUpdate(req.params.id, question)
      .then(function (question) {
        res
          .status(200)
          .json({ message: "Question updated successfully!", data: question });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    Question.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Question deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },

  getFilterRandom: function (req, res) {
    const { matiere_id, item_id, n_questions, user_id, rang, tags, history } =
      req.body;
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const FILTER_BY = {};
    if (matiere_id)
      FILTER_BY.matiere_id = new mongoose.Types.ObjectId(matiere_id);
    if (item_id) FILTER_BY.item_id = new mongoose.Types.ObjectId(item_id);
    if (rang && rang !== "All") FILTER_BY.difficulty = rang === "A";
    if (tags && tags.length > 0)
      FILTER_BY.tags = {
        $in: tags.map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    if (history && history !== "Both") FILTER_BY.tried = history === "Tried";
    const pipeline = [
      {
        $lookup: {
          from: "score_questions",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$question_id", "$$questionId"] },
                  ],
                },
              },
            },
          ],
          as: "score_question",
        },
      },
      {
        $addFields: {
          tried: {
            $cond: {
              if: { $gt: [{ $size: "$score_question" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          score_question: 0,
        },
      },
      { $match: FILTER_BY },
      { $sample: { size: parseInt(n_questions) } },
      { $limit: parseInt(n_questions) },
      {
        $lookup: {
          from: "score_questions",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$question_id", "$$questionId"] },
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
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
    ];
    Question.aggregate(pipeline)
      .then((result) => {
        res.status(200).json({ message: null, data: result });
      })
      .catch((error) => {
        console.error(error);
      });
  },
  getFilterRandomMultiple: function (req, res) {
    const {
      matieres_id,
      items_id,
      n_questions,
      user_id,
      rang,
      tags,
      history,
      difficulty,
    } = req.body;
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    let FILTER_BY = {};
    FILTER_BY.session_id = { $exists: false };

    if (matieres_id)
      FILTER_BY.matiere_id = {
        $in: matieres_id.map((m) => new mongoose.Types.ObjectId(m)),
      };
    if (items_id)
      FILTER_BY.item_id = {
        $in: items_id.map((i) => new mongoose.Types.ObjectId(i)),
      };

    if (rang && rang !== "All") FILTER_BY.difficulty = rang === "A";
    if (tags && tags.length > 0)
      FILTER_BY.tags = {
        $in: tags.map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    if (history && history !== "Both") FILTER_BY.tried = history === "Tried";
    let pipeline_match = FILTER_BY;
    if (difficulty == "not succeded") {
      pipeline_match = {
        $and: [{ "statistics.success": { $lte: 0 } }, FILTER_BY],
      };
    } else if (difficulty == "succeded") {
      pipeline_match = {
        $and: [{ "statistics.success": { $gt: 0 } }, FILTER_BY],
      };
    }
    const pipeline = [
      {
        $lookup: {
          from: "score_questions",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$question_id", "$$questionId"] },
                  ],
                },
              },
            },
          ],
          as: "score_question",
        },
      },
      {
        $addFields: {
          tried: {
            $cond: {
              if: { $gt: [{ $size: "$score_question" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          score_question: 0,
        },
      },
      { $match: pipeline_match },
      { $sample: { size: parseInt(n_questions) } },
      { $limit: parseInt(n_questions) },
      {
        $lookup: {
          from: "score_questions",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$question_id", "$$questionId"] },
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
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
    ];
    Question.aggregate(pipeline)
      .then((result) => {
        res.status(200).json({ message: null, data: result });
      })
      .catch((error) => {
        console.error(error);
      });
  },

  count: function (req, res) {
    const { matiere_id, item_id, user_id, rang, tags, history } = req.body;
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const FILTER_BY = {};
    if (matiere_id)
      FILTER_BY.matiere_id = new mongoose.Types.ObjectId(matiere_id);
    if (item_id) FILTER_BY.item_id = new mongoose.Types.ObjectId(item_id);
    if (rang && rang !== "All") FILTER_BY.difficulty = rang === "A";
    if (tags && tags.length > 0)
      FILTER_BY.tags = {
        $in: tags.map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    if (history && history !== "Both") FILTER_BY.tried = history === "Tried";
    const pipeline = [
      {
        $lookup: {
          from: "score_questions",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$question_id", "$$questionId"] },
                  ],
                },
              },
            },
          ],
          as: "score_question",
        },
      },
      {
        $addFields: {
          tried: {
            $cond: {
              if: { $gt: [{ $size: "$score_question" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          score_question: 0,
        },
      },
      { $match: FILTER_BY },
    ];
    Question.aggregate(pipeline)
      .then((result) => {
        res.status(200).json({ message: null, data: result.length });
      })
      .catch((error) => {
        console.error(error);
      });
  },
  countMultiple: function (req, res) {
    const { matieres_id, items_id, user_id, rang, tags, history, difficulty } =
      req.body;
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const FILTER_BY = {};
    FILTER_BY.session_id = { $exists: false };
    if (matieres_id)
      FILTER_BY.matiere_id = {
        $in: matieres_id.map((_id) => new mongoose.Types.ObjectId(_id)),
      };
    if (items_id)
      FILTER_BY.item_id = {
        $in: items_id.map((_id) => new mongoose.Types.ObjectId(_id)),
      };
    if (rang && rang !== "All") FILTER_BY.difficulty = rang === "A";
    if (tags && tags.length > 0)
      FILTER_BY.tags = {
        $in: tags.map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    if (history && history !== "Both") FILTER_BY.tried = history === "Tried";

    let pipeline_match = FILTER_BY;
    if (difficulty == "not succeded") {
      pipeline_match = {
        $and: [{ "statistics.success": { $lte: 0 } }, FILTER_BY],
      };
    } else if (difficulty == "succeded") {
      pipeline_match = {
        $and: [{ "statistics.success": { $gt: 0 } }, FILTER_BY],
      };
    }

    const pipeline = [
      {
        $lookup: {
          from: "score_questions",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$question_id", "$$questionId"] },
                  ],
                },
              },
            },
          ],
          as: "score_question",
        },
      },
      {
        $addFields: {
          tried: {
            $cond: {
              if: { $gt: [{ $size: "$score_question" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          score_question: 0,
        },
      },
      { $match: pipeline_match },
    ];
    Question.aggregate(pipeline)
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: null, data: result.length });
      })
      .catch((error) => {
        console.error(error);
      });
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
    const PAGE_SIZE = parseInt(pageSize);
    const PAGE_NUMBER = parseInt(pageNumber);
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const SORT_BY = { ...sort };
    const FILTER_BY = {
      question: { $regex: searchText, $options: "i" },
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
    Question.aggregate([
      {
        $lookup: {
          from: "sessions",
          localField: "session_id",
          foreignField: "_id",
          as: "session",
        },
      },
      {
        $unwind: {
          path: "$session",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "score_questions",
          let: { questionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$question_id", "$questionId"] },
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
        console.log(result);
        res.status(200).json({
          message: "QIs found successfully",
          data: result[0].data,
          total_number: result[0].count[0]?.total ?? 0,
        });
      })
      .catch(function (err) {
        console.log(err);
        res.status(400).json({ message: "QIs not found", data: null });
      });
  },
};
