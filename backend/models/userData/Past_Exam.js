const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PastExamSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  history_data: {
    type: Object,
    required: true,
    index: false,
  },
  taken_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  favorite: {
    type: Boolean,
    required: false,
    default: false,
  },
});

PastExamSchema.pre("save", function (next) {
  this.taken_at = Date.now();
  next();
});

module.exports = mongoose.model("Past_Exams", PastExamSchema);
