const mongoose = require("mongoose");
const ItemStatusModel = require('../../models/userData/Item_Status')

module.exports = {
  create: async function (req, res) {
    const itemStatus = req.body;
    await ItemStatusModel.create(itemStatus)
      .then(function (result) {
        res.status(200).json({
          message: "Status added successfully!!!",
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
    let data = await ItemStatusModel.find()
    res.status(200).json({ message: null, data: data });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let data = await ItemStatusModel.find(filter);
    res.status(200).json({ message: null, data: data });
  },
  getById: function (req, res) {
    ItemStatusModel.findById(req.params.id)
      .then(function (data) {
        res.status(200).json({ message: null, data: data });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "ItemStatusModel not found", data: null });
      });
  },
  updateById: function (req, res) {
    const data = req.body;
    ItemStatusModel.findByIdAndUpdate(req.params.id, data)
      .then(function (data) {
        res
          .status(200)
          .json({ message: "ItemStatus updated successfully!", data: data });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    ItemStatusModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "ItemStatus deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
