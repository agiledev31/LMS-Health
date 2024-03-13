const ProgressModel = require("../../models/userData/Progress_Matiere");

module.exports = {
  getAll: async function (req, res) {
    let progressData = await ProgressModel.find();
    res.status(200).json({ message: null, data: progressData });
  },
  getFilter: function (req, res) {
    const filter = req.body;
    ProgressModel.find(filter).then(function (progressData) {
      res.status(200).json({ message: null, data: progressData });
    }).catch(function (err) {
      res.status(400).json({ message: err, data: null });
      console.log(err);
    });
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
