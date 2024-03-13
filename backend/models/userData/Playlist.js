const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  color: String,
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = Playlist;
