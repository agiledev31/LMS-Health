const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uuid = require("node-uuid");

const QuestionSchema = new Schema(
  {
    question_number: {
      type: String,
      default: function genUUID() {
        uuid.v1();
      },
      // required: true,
    },
    desc: String,
    question: {
      type: String,
      required: true,
    },
    statistics: {
      total: { type: Number, default: 0 },
      success: { type: Number, default: 0 },
    },
    matiere_id: {
      type: Schema.Types.ObjectId,
      ref: "Matiere",
      // required: true,
    },
    item_id: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      // required: true,
    },
    dp_id: {
      type: Schema.Types.ObjectId,
      ref: "DP",
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    comment: {
      type: String,
      // required: true,
    },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    difficulty: { type: Boolean, required: true, default: true }, // true means the rank A, false means the rank B
    // when QI is added to the annales
    session_id: {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
    matieres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Matiere",
      },
    ],
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    imageUrl: String,
    // videoPath: { type: String },
  },
  {
    indexes: [{ matiere_id: 1, item_id: 1, dp_id: 1 }],
  }
);

const MultiChoiceSchema = new Schema({
  answers: [{ choice: String, desc: String, answer: Boolean }],
});

const TrueOrFalseSchema = new Schema({
  answer: {
    type: Boolean,
    required: true,
  },
});

const ShortAnswerSchema = new Schema({
  answers: [
    {
      type: String,
    },
  ],
});

const Counter = require("./Counter");
QuestionSchema.pre("save", async function (next) {
  // console.log("increase corresponding Matiere n_quetions by 1");
  if (this.matiere_id) {
    const MatiereModel = require("./Matiere");
    await MatiereModel.findByIdAndUpdate(this.matiere_id, {
      $inc: { n_questions: 1 },
    });
  }
  if (this.item_id) {
    const ItemModel = require("./Item");
    await ItemModel.findByIdAndUpdate(this.item_id, {
      $inc: { n_questions: 1 },
    });
  }
  if (this.session_id) {
    const SessionModel = require("./Session");
    const session = await SessionModel.findById(this.session_id);
    if (session) {
      session.n_questions += 1;
      await session.save();
    }
  }
  // if (this.matiere_id && !this.question_number) {
  //   const counter = await Counter.findByIdAndUpdate(
  //     { _id: "Question" },
  //     { $inc: { seq: 1 } },
  //     { new: true }
  //   );
  //   if (counter) {
  //     this.question_number = counter.seq;
  //   } else {
  //     await Counter.create({
  //       _id: "Question",
  //       seq: 0,
  //     });
  //   }
  // }
  next();
});

QuestionSchema.pre("findOneAndRemove", async function (next) {
  const doc = await this.model.findOne(this.getFilter());
  this.matiere_id = doc.matiere_id;
  this.item_id = doc.item_id;
  this.dp_id = doc.dp_id;
  if (this.matiere_id) {
    const MatiereModel = require("./Matiere");
    const matiere = await MatiereModel.findById(this.matiere_id);
    if (matiere) {
      matiere.n_questions -= 1;
      await matiere.save();
    }
  }
  if (this.item_id) {
    const ItemModel = require("./Item");
    const item = await ItemModel.findById(this.item_id);
    if (item) {
      item.n_questions -= 1;
      await item.save();
    }
  }
  if (this.dp_id) {
    const DPModel = require("./DP");
    const dp = await DPModel.findById(this.dp_id);
    if (dp) {
      dp.n_questions -= 1;
      dp.questions = dp.questions.filter((_id) => _id !== doc._id);
      await dp.save();
    }
  }
  if (this.session_id) {
    const SessionModel = require("./Session");
    const session = await SessionModel.findById(this.session_id);
    if (session) {
      session.n_questions -= 1;
      await session.save();
    }
  }
  next();
});

const Question = mongoose.model("Question", QuestionSchema);
const MultiChoice = Question.discriminator("MultiChoice", MultiChoiceSchema);
const TrueOrFalse = Question.discriminator("TrueOrFalse", TrueOrFalseSchema);
const ShortAnswer = Question.discriminator("ShortAnswer", ShortAnswerSchema);

module.exports = { Question, MultiChoice, TrueOrFalse, ShortAnswer, Counter };
