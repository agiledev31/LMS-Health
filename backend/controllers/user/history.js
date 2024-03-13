const mongoose = require("mongoose");
const HistoryModel = require("../../models/userData/Past_Exam");
const SavedExamModel = require("../../models/userData/Saved_Exam");
module.exports = {
  create: async function (req, res) {
    const historyItem = req.body;
    await HistoryModel.create(historyItem)
      .then(function (result) {
        res.status(200).json({
          message: "History updated successfully!",
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
    const { user_id } = req.params;
    console.log(user_id);
    let data = await HistoryModel.find({ user_id: user_id })
      .sort({ taken_at: -1 })
      .limit(10);

    res.status(200).json({ message: null, data: data });
  },

  updateById: function (req, res) {
    const history = req.body;

    HistoryModel.findByIdAndUpdate(req.params.id, history, { new: true })
      .then(function (new_history) {
        res.status(200).json({
          message: "History item updated successfully!",
          data: new_history,
        });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  saveExam: async function (req, res) {
    const savedExamItem = req.body;

    await SavedExamModel.deleteOne({ user_id: savedExamItem.user_id });

    await SavedExamModel.create(savedExamItem)
      .then(function (result) {
        res.status(200).json({
          message: "Exam saved successfully!",
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
  getSavedExam: async function (req, res) {
    const { user_id } = req.params;
    let data = await SavedExamModel.find({ user_id: user_id });

    res.status(200).json({ message: null, data: data });
  },
  deleteSavedExams: async function (req, res) {
    const { user_id } = req.params;
    SavedExamModel.deleteOne({ user_id: user_id })
      .then(() => {
        res.status(200).send();
      })
      .catch(() => {
        res.status(500).send();
      });
  },
};
