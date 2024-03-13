const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  n_questions: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("Tag", TagSchema);
