const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistQuestionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  playlist_id: {
    type: Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
    index: true,
  },
  question_id: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
    index: true,
  },
  matiere_id: {
    type: Schema.Types.ObjectId,
    ref: "Matiere",
  },
  item_id: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
});
PlaylistQuestionSchema.pre("save", async function (next) {
  const { Question } = require("../learningData/Question");
  const question = await Question.findById(this.question_id);
  if (question.matiere_id) this.matiere_id = question.matiere_id;
  if (question.item_id) this.item_id = question.item_id;
  next();
});

module.exports = mongoose.model("Playlist_Question", PlaylistQuestionSchema);
