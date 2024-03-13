const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  }]
});

module.exports = mongoose.model("Card", CardSchema);
