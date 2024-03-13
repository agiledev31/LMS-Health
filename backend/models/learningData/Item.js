const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  item_number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  matiere_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Matiere",
    required: true,
    index: true,
  },
  objects: [{ title: String, isRankA: Boolean }],
  n_questions: {
    type: Number,
    required: true,
    default: 0,
  },
});

ItemSchema.pre("save", async function (next) {
  const MatiereModel = require("./Matiere");
  const matiere = await MatiereModel.findById(this.matiere_id);
  if (matiere) {
    matiere.n_items += 1;
    await matiere.save();
  }
  next();
});

ItemSchema.post("deleteOne", async function (next) {
  const MatiereModel = require("./Matiere");
  const matiere = await MatiereModel.findById(this.matiere_id);
  if (matiere) {
    matiere.n_items -= 1;
    await matiere.save();
  }
  next();
});

module.exports = mongoose.model("Item", ItemSchema);
