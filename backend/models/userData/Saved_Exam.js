const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SavedExamSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  exam_data: {
    type: Object,
    required: true,
    index: false,
  },
  is_exam: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("Saved_Exam", SavedExamSchema);
