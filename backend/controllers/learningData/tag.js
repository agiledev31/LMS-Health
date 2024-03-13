const TagModel = require("../../models/learningData/Tag");

module.exports = {
  create: async function (req, res) {
    const tag = req.body;
    await TagModel.create(tag)
      .then(function (result) {
        res.status(200).json({
          message: "Tag added successfully!!!",
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
    let tags = await TagModel.find();
    res.status(200).json({
      message: null,
      data: tags,
    });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let tags = await TagModel.find(filter);
    res.status(200).json({ message: null, data: tags });
  },
  getById: function (req, res) {
    TagModel.findById(req.params.id)
      .then(function (tag) {
        res.status(200).json({ message: null, data: tag });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Tag not found", data: null });
      });
  },
  updateById: function (req, res) {
    const tag = req.body;
    TagModel.findByIdAndUpdate(req.params.id, tag)
      .then(function (tag) {
        res
          .status(200)
          .json({ message: "Tag updated successfully!", data: tag });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    console.log(req.params.id);
    TagModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Tag deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
