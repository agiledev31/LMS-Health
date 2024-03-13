const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  n_dps: {
    type: Number,
    default: 0,
    required: true,
  },
  n_questions: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
