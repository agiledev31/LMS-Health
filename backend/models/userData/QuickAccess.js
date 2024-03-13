const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuickAccessSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    matiere_or_item_id: {
      type: Schema.Types.ObjectId,
      required: true,
      refpath: "MatiereOrItem",
    },
    MatiereOrItem: {
      type: String,
      required: true,
      enum: ["Matiere", "Item"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    indexes: [{ user_id: 1 }],
  }
);

module.exports = mongoose.model("QuickAccess", QuickAccessSchema);
