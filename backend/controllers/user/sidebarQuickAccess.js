const QuickAccessModel = require("../../models/userData/SidebarQuickAccess");

module.exports = {
  create: async function (req, res) {
    const quickAccess = req.body;
    await QuickAccessModel.create(quickAccess)
      .then(function (result) {
        res.status(200).json({
          message: "Item was added to quick access successfully!!!",
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
  getFilter: async function (req, res) {
    let result = await QuickAccessModel.find(req.body);
    res.status(200).json({ message: null, data: result });
  },
  deleteById: function (req, res) {
    QuickAccessModel.findByIdAndRemove(req.params.id)
      .then(function () {
        res
          .status(200)
          .json({ message: "item was deleted from quick access successfully!", data: null });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Delete failed", data: null });
      });
  },
};
