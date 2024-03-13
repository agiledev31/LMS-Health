const mongoose = require("mongoose");
const ScheduleModel = require("../../models/userData/Schedule");

module.exports = {
  create: async function (req, res) {
    const report = req.body;
    await ScheduleModel.create(report)
      .then(function (result) {
        res.status(200).json({
          message: "Schedule saved successfully!!!",
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
    let data = await ScheduleModel.find();
    res.status(200).json({ message: null, data: data });
  },
  getFilter: async function (req, res) {
    const USER_ID = new mongoose.Types.ObjectId(req.body.user_id);
    ScheduleModel.aggregate([
      {
        $match: {
          user_id: USER_ID,
        },
      },
      {
        $addFields: {
          collectionName: {
            $cond: {
              if: { $eq: ["$MatiereOrItem", "Matiere"] },
              then: "matieres",
              else: "items",
            },
          },
        },
      },
      {
        $lookup: {
          from: "$collectionName",
          localField: "matiere_or_item_id",
          foreignField: "_id",
          as: "matiere_or_item",
        },
      },
    ])
      .then(function (result) {
        res.status(200).json({
          message: "Found successfully",
          data: result,
        });
      })
      .catch(function (err) {
        console.log(err);
        res.status(400).json({ message: "Not found", data: null });
      });
  },
  getById: function (req, res) {
    ScheduleModel.findById(req.params.id)
      .then(function (data) {
        res.status(200).json({ message: null, data: data });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Schedule not found", data: null });
      });
  },
  updateById: function (req, res) {
    const data = req.body;
    ScheduleModel.findByIdAndUpdate(req.params.id, data)
      .then(function (data) {
        res
          .status(200)
          .json({ message: "Schedule updated successfully!", data: data });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    ScheduleModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Schedule deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
