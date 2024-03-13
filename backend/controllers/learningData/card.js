const CardModel = require("../../models/learningData/Card");

module.exports = {
  create: async function (req, res) {
    const card = req.body;
    await CardModel.create(card)
      .then(function (result) {
        res.status(200).json({
          message: "Card added successfully!!!",
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
    let cards = await CardModel.find().populate("items");
    res.status(200).json({ message: null, data: cards });
  },
  getAllWithOutContent: async function (req, res) {
    let cards = await CardModel.find().select("-content").populate("items");
    res.status(200).json({ message: null, data: cards });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let cards = await CardModel.find(filter);
    res.status(200).json({ message: null, data: cards });
  },
  getFilterByItem: async function (req, res) {
    const { item_id } = req.body;
    let cards = await CardModel.find({
      items:  item_id
    }).select("-content").populate("items");
    res.status(200).json({ message: null, data: cards });
  },
  getById: function (req, res) {
    CardModel.findById(req.params.id)
      .then(function (card) {
        res.status(200).json({ message: null, data: card });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Card not found", data: null });
      });
  },
  updateById: function (req, res) {
    const card = req.body;
    CardModel.findByIdAndUpdate(req.params.id, card)
      .populate("items")
      .then(function (updatedCard) {
        res
          .status(200)
          .json({ message: "Card updated successfully!", data: updatedCard });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    CardModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Card deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
