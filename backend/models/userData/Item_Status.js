const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemStatusSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  item_id: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
    index: true,
  },
  status: {
    type: String,
    required: true,
    default: "",
  },
});

module.exports = mongoose.model("Item_Status", ItemStatusSchema);
