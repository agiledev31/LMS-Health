const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  nickname: { type: String, default: "" },
  completedEducationalInfo: { type: Boolean, default: false, required: false },
  university: { type: String, required: false },
  education_year: { type: String, required: false, default: "" },
  verified: { type: Boolean, required: true, default: true },
  role: { type: String, required: true, default: "user" },
  createdAt: { type: Date, default: Date.now() },
  first_name: String,
  last_name: String,
  user_name: String,
});

module.exports = mongoose.model("User", UserSchema);
