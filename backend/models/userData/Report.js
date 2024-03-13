const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    sent_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    indexes: [{ seen: 1, user_id: 1, sent_at: 1 }],
  }
);

ReportSchema.pre("save", function (next) {
  this.sent_at = Date.now();
  next();
});

module.exports = mongoose.model("Report", ReportSchema);
