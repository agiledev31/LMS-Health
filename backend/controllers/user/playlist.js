const mongoose = require("mongoose");
const PlaylistModel = require("../../models/userData/Playlist");
const PlaylistQuestionModel = require("../../models/userData/Playlist_Question");

module.exports = {
  createPlaylist: async function (req, res) {
    const playlist = req.body;
    await PlaylistModel.create(playlist)
      .then(function (result) {
        res.status(200).json({
          message: "Playlist added successfully!!!",
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
  addQuestion: async function (req, res) {
    const { question_id, user_id, playlist_id } = req.body;
    await PlaylistQuestionModel.create({ question_id, user_id, playlist_id })
      .then(function (result) {
        res.status(200).json({
          message: "Question added successfully!!!",
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
    let playlists = await PlaylistModel.find();
    res.status(200).json({ message: null, data: playlists });
  },
  getAllWithQuestions: async function (req, res) {
    let playlists = await PlaylistQuestionModel.find().populate("playlist_id");
    res.status(200).json({ message: null, data: playlists });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let playlists = await PlaylistModel.find(filter);
    res.status(200).json({ message: null, data: playlists });
  },
  getFilterWithQuestion: async function (req, res) {
    const filter = req.body;
    let playlists = await PlaylistQuestionModel.find(filter);
    // .populate("playlist_id");
    res.status(200).json({ message: null, data: playlists });
  },
  getFilterGetPlaylist: async function (req, res) {
    const filter = req.body;
    let playlists = await PlaylistQuestionModel.find(filter).populate(
      "playlist_id"
    );
    res.status(200).json({ message: null, data: playlists });
  },
  getPage: function (req, res) {
    const {
      pageSize,
      pageNumber,
      user_id,
      matiere_id,
      item_id,
      playlist_id,
      filter,
      sort,
    } = req.body;
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const PAGE_SIZE = parseInt(pageSize);
    const PAGE_NUMBER = parseInt(pageNumber);
    const FILTER_BY = {
      ...filter,
      user_id: USER_ID,
      matiere_id: new mongoose.Types.ObjectId(matiere_id),
      item_id: new mongoose.Types.ObjectId(item_id),
      playlist_id: new mongoose.Types.ObjectId(playlist_id),
    };
    if (!matiere_id) delete FILTER_BY.matiere_id;
    if (!item_id) delete FILTER_BY.item_id;
    if (!playlist_id) delete FILTER_BY.playlist_id;

    const SORT_BY = { ...sort };

    PlaylistQuestionModel.aggregate([
      {
        $match: FILTER_BY,
      },
      {
        $group: { _id: "$question_id", playlists: { $push: "$playlist_id" } },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $lookup: {
          from: "playlists",
          localField: "playlists",
          foreignField: "_id",
          as: "playlist",
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
          path: "$question",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$score",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          playlists: 0,
        },
      },
      {
        $addFields: {
          question_id: "$question._id",
          question_number: "$question.question_number",
          question: "$question.question",
          playlists: "$playlist",
          user_score: "$score.user_score",
          total_score: "$score.total_score",
          last_assess: "$score.last_assess",
        },
      },
      {
        $project: {
          score: 0,
          playlist: 0,
        },
      },
      {
        $facet: {
          data: [
            {
              $sort: SORT_BY,
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
              $count: "total",
            },
          ],
        },
      },
    ])
      .then(function (result) {
        res.status(200).json({
          message: null,
          data: result[0].data,
          total_number: result[0].count[0]?.total ?? 0,
        });
      })
      .catch(function (err) {
        console.log(err);
        res.status(400).json({ message: "playlists not found", data: null });
      });
  },
  getById: function (req, res) {
    PlaylistModel.findById(req.params.id)
      .then(function (playlist) {
        res.status(200).json({ message: null, data: playlist });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Playlist not found", data: null });
      });
  },
  getByIdWithQuestion: function (req, res) {
    PlaylistQuestionModel.findById(req.params.id)
      .then(function (playlist) {
        res.status(200).json({ message: null, data: playlist });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Playlist not found", data: null });
      });
  },
  updateById: function (req, res) {
    const playlist = req.body;
    PlaylistModel.findByIdAndUpdate(req.params.id, playlist)
      .then(function (playlist) {
        res
          .status(200)
          .json({ message: "Playlist updated successfully!", data: playlist });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    PlaylistModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Playlist deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
  deleteQuestionFromPlaylist: function (req, res) {
    const { user_id, question_id } = req.body;
    PlaylistQuestionModel.deleteMany({
      user_id: user_id,
      question_id,
    })
      .then(function () {
        res
          .status(200)
          .json({ message: "Playlist deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
