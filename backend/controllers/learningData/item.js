const ItemModel = require("../../models/learningData/Item");
const mongoose = require("mongoose");

module.exports = {
  count: async function (req, res) {
    await ItemModel.count()
      .then(function (count) {
        res.status(200).json({
          message: "Success",
          data: count,
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
  create: async function (req, res) {
    const item = req.body;
    await ItemModel.create(item)
      .then(function (result) {
        res.status(200).json({
          message: "Item added successfully!!!",
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
    let items = await ItemModel.find();
    res.status(200).json({ message: null, data: items });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let items = await ItemModel.find(filter);
    res.status(200).json({ message: null, data: items });
  },
  getById: function (req, res) {
    ItemModel.findById(req.params.id)
      .then(function (item) {
        res.status(200).json({ message: null, data: item });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Item not found", data: null });
      });
  },
  updateById: function (req, res) {
    const item = req.body;
    ItemModel.findByIdAndUpdate(req.params.id, item)
      .then(function (item) {
        res
          .status(200)
          .json({ message: "Item updated successfully!", data: item });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    ItemModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Item deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
  getPage: async function (req, res) {
    const { user_id, pageSize, pageNumber, searchText, filter, sort } =
      req.body;
    const USER_ID = new mongoose.Types.ObjectId(user_id);
    const PAGE_SIZE = parseInt(pageSize);
    const PAGE_NUMBER = parseInt(pageNumber);
    const FILTER_BY = {
      ...filter,
      $or: [
        { name: { $regex: searchText, $options: "i" } },
        { item_number_str: { $regex: searchText, $options: "i" } },
      ],
      matiere_id: new mongoose.Types.ObjectId(filter.matiere_id),
    };
    if (!filter.matiere_id) delete FILTER_BY.matiere_id;
    const SORT_BY = { ...sort, item_number: 1 };

    ItemModel.aggregate([
      {
        $lookup: {
          from: "item_statuses",
          let: { itemId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$item_id", "$$itemId"] },
                  ],
                },
              },
            },
          ],
          as: "item_status",
        },
      },
      {
        $lookup: {
          from: "progress_items",
          let: { itemId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", USER_ID] },
                    { $eq: ["$item_id", "$$itemId"] },
                  ],
                },
              },
            },
          ],
          as: "item_progress",
        },
      },
      {
        $unwind: {
          path: "$item_status",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$item_progress",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          status: "$item_status.status",
          status_id: "$item_status._id",
          progress: "$item_progress.progress_rate",
        },
      },
      {
        $addFields: {
          item_number_str: { $toString: "$item_number" },
        },
      },
      {
        $project: {
          item_status: 0,
          item_progress: 0,
        },
      },
      {
        $facet: {
          data: [
            {
              $match: FILTER_BY,
            },
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
              $match: FILTER_BY,
            },
            {
              $count: "total",
            },
          ],
        },
      },
    ])
      .then((result) => {
        res.status(200).json({
          message: null,
          data: result[0].data,
          total_number: result[0].count[0]?.total ?? 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
