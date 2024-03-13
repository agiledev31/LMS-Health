const mongoose = require("mongoose");
const Session = require("../models/learningData/Session");

mongoose.connect(process.env.mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log(`mongoDB connected successfully`);
  initial();
});

connection.on("error", (err) => {
  console.log(`mongoDB connection failed`);
  console.error(err);
  process.exit();
});

async function initial() {
  const User = require("../models/auth/User");
  // const { Counter } = require("../models/learningData/Question");

  const bcrypt = require("bcryptjs");
  const admin = {
    email: process.env.adminEmail,
    password: bcrypt.hashSync(process.env.adminPassword, 8),
    verified: true,
    completedEducationalInfo: true,
    role: "admin",
  };
  await User.deleteMany({ role: "admin" });

  await User.create(admin);
  // await Counter.findOneAndUpdate({ _id: "Question"}, { _id: "Question", seq: 1 });
  const Matiere = require("../models/learningData/Matiere");
  const Item = require("../models/learningData/Item");
  const { Question } = require("../models/learningData/Question");
  const DP = require("../models/learningData/DP");

  // await Matiere.deleteMany({});
  // await Item.deleteMany();
  // await Question.deleteMany();
  // await DP.deleteMany();

  // const items = await Item.find();
  // try {
  //   items.forEach(async (item) => {
  //     const n_question = await Question.countDocuments({ item_id: item._id });
  //     item.n_questions = n_question;
  //     await item.save();
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  // Matiere.find()
  //   .then((matieres) => {
  //     matieres.forEach(async (matiere) => {
  //       const n_questions = await Question.countDocuments({
  //         matiere_id: matiere._id,
  //       });
  //       const n_items = await Item.countDocuments({ matiere_id: matiere._id });
  //       matiere.n_questions = n_questions;
  //       matiere.n_items = n_items;
  //       matiere.save();
  //     });
  //   })
  //   .catch((error) => {
  //     if (err) console.log(error);
  //   });

  // Matiere.collection.insertMany(
  //   importMatieres.map((x) => {
  //     let aux = x;
  //     aux._id = new mongoose.Types.ObjectId(x._id.$oid);
  //     return aux;
  //   }),
  //   (err, r) => {
  //     if (err) console.log(err);
  //   }
  // );

  // Item.collection.insertMany(
  //   importItems.map((x) => {
  //     let aux = x;
  //     aux._id = new mongoose.Types.ObjectId(x._id.$oid);
  //     aux.matiere_id = new mongoose.Types.ObjectId(x.matiere_id.$oid);
  //     return aux;
  //   }),
  //   (err, r) => {
  //     if (err) console.log(err);
  //   }
  // );
  // Question.collection.insertMany(
  //   importQuestions.map((x) => {
  //     let aux = x;
  //     aux._id = new mongoose.Types.ObjectId(x._id.$oid);
  //     if (aux.matiere_id)
  //       aux.matiere_id = new mongoose.Types.ObjectId(x.matiere_id.$oid);

  //     if (aux.item_id)
  //       aux.item_id = new mongoose.Types.ObjectId(x.item_id.$oid);

  //     let aux_answers = aux.answers.map((ans) => {
  //       let aux_ans = ans;
  //       if (ans._id) aux_ans._id = new mongoose.Types.ObjectId(ans._id.$oid);
  //       return ans;
  //     });
  //     aux.answers = aux_answers;
  //     return aux;
  //   }),
  //   (err, r) => {
  //     if (err) console.log(err);
  //   }
  // );

  // DP.collection.insertMany(
  //   importDps.map((x) => {
  //     let aux = x;
  //     aux._id = new mongoose.Types.ObjectId(x._id.$oid);
  //     let aux_matieres = x.matieres.map(
  //       (mt) => new mongoose.Types.ObjectId(mt.$oid)
  //     );

  //     aux.matieres = aux_matieres;

  //     let aux_items = x.items.map(
  //       (itm) => new mongoose.Types.ObjectId(itm.$oid)
  //     );
  //     aux.items = aux_items;

  //     let aux_questions = x.questions.map(
  //       (q) => new mongoose.Types.ObjectId(q.$oid)
  //     );
  //     aux.questions = aux_questions;
  //     return aux;
  //   }),
  //   (err, r) => {
  //     if (err) console.log(err);
  //   }
  // );
}

module.exports = connection;
