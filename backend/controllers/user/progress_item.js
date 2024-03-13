const ProgressModel = require("../../models/userData/Progress_Item");

module.exports = {
  getAll: async function (req, res) {
    let progressData = await ProgressModel.find();
    res.status(200).json({ message: null, data: progressData });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let progressData = await ProgressModel.find(filter);
    res.status(200).json({ message: null, data: progressData });
  },
  deleteById: function (req, res) {
    ProgressModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Progress deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
