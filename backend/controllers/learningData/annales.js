const mongoose = require("mongoose");
const DPModel = require("../../models/learningData/DP");

const {
  Question,
  MultiChoice,
  TrueOrFalse,
  ShortAnswer,
} = require("../../models/learningData/Question");

const getFilteredDps = async ({
  user_id,
  pageSize,
  pageNumber,
  searchText,
  session_id,
  filter,
  sort,
}) => {
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

  return await DPModel.aggregate([
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
  ]);
};

const getFilteredQuestions = async ({
  user_id,
  pageSize,
  pageNumber,
  searchText,
  session_id,
  filter,
  sort,
}) => {
  const PAGE_SIZE = parseInt(pageSize);
  const PAGE_NUMBER = parseInt(pageNumber);
  const USER_ID = new mongoose.Types.ObjectId(user_id);
  const SORT_BY = { ...sort };
  const FILTER_BY = {
    question: { $regex: searchText, $options: "i" },
  };
  if (session_id) {
    FILTER_BY.session_id = new mongoose.Types.ObjectId(session_id);
  } else {
    FILTER_BY.session_id = { $exists: true };
  }

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

  return await Question.aggregate([
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
  ]);
};

module.exports = {
  getPage: async function (req, res) {
    const {
      user_id,
      pageSize,
      pageNumber,
      searchText,
      session_id,
      filter,
      sort,
      show_dp,
      show_qi,
    } = req.body;
    const PAGE_SIZE = parseInt(pageSize);
    const PAGE_NUMBER = parseInt(pageNumber);
    const filtered_dps = show_dp
      ? await getFilteredDps(req.body)
      : [{ count: [{ total: 0 }], data: [] }];
    const filtered_questions = show_qi
      ? await getFilteredQuestions(req.body)
      : [{ count: [{ total: 0 }], data: [] }];
    let total_number =
      filtered_dps[0].count[0]?.total + filtered_questions[0].count[0]?.total;
    let combined_results = filtered_dps[0].data.concat(
      filtered_questions[0].data
    );
    res.status(200).json({
      message: "Element found successfully",
      data: combined_results.slice(
        (PAGE_NUMBER - 1) * PAGE_SIZE,
        Math.min(combined_results.length, PAGE_NUMBER * PAGE_SIZE)
      ),
      total_number: total_number,
    });
  },
  countMultiple: function (req, res) {
    const { matieres_id, items_id, user_id, rang, tags, history, difficulty } =
      req.body;
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const FILTER_BY = {};
    FILTER_BY.session_id = { $exists: true };

    if (matieres_id)
      FILTER_BY.matieres = {
        $in: matieres_id.map((_id) => new mongoose.Types.ObjectId(_id)),
      };
    if (items_id)
      FILTER_BY.items = {
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
    FILTER_BY.session_id = { $exists: true };

    if (matieres_id)
      FILTER_BY.matieres = {
        $in: matieres_id.map((m) => new mongoose.Types.ObjectId(m)),
      };
    if (items_id)
      FILTER_BY.items = {
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
};
