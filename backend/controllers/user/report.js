const ReportModel = require("../../models/userData/Report");

module.exports = {
  create: async function (req, res) {
    const report = req.body;
    await ReportModel.create(report)
      .then(function (result) {
        res.status(200).json({
          message: "Report saved successfully!!!",
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
    let data = await ReportModel.find()
      .populate("user_id")
      .populate("question");
    res.status(200).json({ message: null, data: data });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let data = await ReportModel.find(filter);
    res.status(200).json({ message: null, data: data });
  },
  getById: function (req, res) {
    ReportModel.findById(req.params.id)
      .then(function (data) {
        res.status(200).json({ message: null, data: data });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Report not found", data: null });
      });
  },
  updateById: function (req, res) {
    const data = req.body;
    ReportModel.findByIdAndUpdate(req.params.id, data)
      .then(function (data) {
        res
          .status(200)
          .json({ message: "Report updated successfully!", data: data });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    ReportModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Report deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
