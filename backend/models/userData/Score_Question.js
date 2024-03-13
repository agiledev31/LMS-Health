const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProcessMatiereModel = require("./Progress_Matiere");
const ProcessItemModel = require("./Progress_Item");
const { Question: QuestionModel } = require("../learningData/Question");

const ScoreQuestionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matiere_id: {
      type: Schema.Types.ObjectId,
      ref: "Matiere",
    },
    item_id: {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
    dp_id: {
      type: Schema.Types.ObjectId,
      ref: "DP",
    },
    question_id: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    user_score: {
      type: Number,
      required: true,
    },
    total_score: {
      type: Number,
      required: true,
    },
    last_assess: {
      type: Date,
    },
  },
  {
    indexes: [{ user_id: 1, matiere_id: 1, item_id: 1, dp_id: 1 }],
  }
);

ScoreQuestionSchema.pre("save", async function (next) {
  const success_increament = this.user_score === 20 ? 1 : 0;
  await QuestionModel.findByIdAndUpdate(
    this.question_id,
    {
      $inc: {
        "statistics.total": 1,
        "statistics.success": success_increament,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
  if (this.matiere_id) {
    const matiereProgress = await ProcessMatiereModel.findOne({
      user_id: this.user_id,
      matiere_id: this.matiere_id,
    });
    if (matiereProgress) {
      if (!this.last_assess) matiereProgress.progress_rate += 1;
      if (this.user_score === 20) {
        matiereProgress.success_rate.excellent += 1;
      } else if (this.user_score >= 10) {
        matiereProgress.success_rate.good += 1;
      } else if (this.user_score >= 5) {
        matiereProgress.success_rate.average += 1;
      } else {
        matiereProgress.success_rate.poor += 1;
      }
      await matiereProgress.save();
    } else {
      const newMatiereProgress = new ProcessMatiereModel({
        user_id: this.user_id,
        matiere_id: this.matiere_id,
        progress_rate: 1,
        success_rate: {
          excellent: this.user_score === 20 ? 1 : 0,
          good: this.user_score >= 10 && this.user_score < 20 ? 1 : 0,
          average: this.user_score >= 5 && this.user_score < 10 ? 1 : 0,
          poor: this.user_score < 5 ? 1 : 0,
        },
      });
      await newMatiereProgress.save();
    }
  }
  if (this.item_id) {
    const itemProgress = await ProcessItemModel.findOne({
      user_id: this.user_id,
      item_id: this.item_id,
    });
    if (itemProgress) {
      if (!this.last_assess) itemProgress.progress_rate += 1;
      if (this.user_score === 20) {
        itemProgress.success_rate.excellent += 1;
      } else if (this.user_score >= 10) {
        itemProgress.success_rate.good += 1;
      } else if (this.user_score >= 5) {
        itemProgress.success_rate.average += 1;
      } else {
        itemProgress.success_rate.poor += 1;
      }
      await itemProgress.save();
    } else {
      const newItemProgress = new ProcessItemModel({
        user_id: this.user_id,
        item_id: this.item_id,
        progress_rate: 1,
        success_rate: {
          excellent: this.user_score === 20 ? 1 : 0,
          good: this.user_score >= 10 && this.user_score < 20 ? 1 : 0,
          average: this.user_score >= 5 && this.user_score < 10 ? 1 : 0,
          poor: this.user_score < 5 ? 1 : 0,
        },
      });
      await newItemProgress.save();
    }
  }
  this.last_assess = Date.now();
  next();
});

module.exports = mongoose.model("Score_Question", ScoreQuestionSchema);
