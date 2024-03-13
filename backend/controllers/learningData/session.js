const SessionModel = require("../../models/learningData/Session");

module.exports = {
  create: async function (req, res) {
    const session = req.body;
    await SessionModel.create(session)
      .then(function (result) {
        res.status(200).json({
          message: "Session added successfully!!!",
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
    let sessions = await SessionModel.find();
    res.status(200).json({
      message: null,
      data: sessions,
    });
  },
  getFilter: async function (req, res) {
    const filter = req.body;
    let sessions = await SessionModel.find(filter);
    res.status(200).json({ message: null, data: sessions });
  },
  getById: function (req, res) {
    SessionModel.findById(req.params.id)
      .then(function (session) {
        res.status(200).json({ message: null, data: session });
      })
      .catch(function (err) {
        console.error(err);
        res.status(404).json({ message: "Session not found", data: null });
      });
  },
  updateById: function (req, res) {
    const session = req.body;
    SessionModel.findByIdAndUpdate(req.params.id, session)
      .then(function (session) {
        res
          .status(200)
          .json({ message: "Session updated successfully!", data: session });
      })
      .catch(function (err) {
        console.error(err);
        res.status(400).json({ message: "Update failed", data: null });
      });
  },
  deleteById: function (req, res) {
    SessionModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "Session deleted successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
