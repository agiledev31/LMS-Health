const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreDPSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dp_id: {
      type: Schema.Types.ObjectId,
      ref: "DP",
    },
    user_score: {
      type: Number,
      required: true,
    },
    total_score: {
      type: Number,
      required: true,
    },
    last_assess: {
      type: Date,
    },
  },
  {
    indexes: [{ user_id: 1, dp_id: 1 }],
  }
);

ScoreDPSchema.pre("findOneAndUpdate", function (next) {
  this._update.last_assess = Date.now();
  next();
});

module.exports = mongoose.model("Score_DP", ScoreDPSchema);
