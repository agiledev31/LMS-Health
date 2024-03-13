const mongoose = require("mongoose");
const User = require("../../models/auth/User");

module.exports = {
  addEducationalInfo: async function (req, res, next) {
    const { user, university, education_year, nickname } = req.body;
    console.log(user);
    User.findById(user.id).then(async (user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { user: "user not found" },
        });
      }

      if (!user.verified) {
        return res.status(404).json({
          success: false,
          error: {
            email: "Not a verified email address!",
          },
        });
      }
      let aux_user = user;
      aux_user.completedEducationalInfo = true;
      aux_user.university = university;
      aux_user.education_year = education_year;
      aux_user.nickname = nickname;
      User.findByIdAndUpdate(user._id, aux_user)
        .then((result) => {
          res.status(200).json({
            message: "Educational info updated successfully!",
            data: { id: result._id },
          });
        })
        .catch((err) => {
          if (err)
            res
              .status(400)
              .json({ message: "Update password failed", data: err });
        });
    });
  },
  updateUser: async function (req, res) {
    const { userData } = req.body;
    const user = await User.findById(userData.sub.replace(/^auth0\|/i, ''));
    if (!user)
      User.create({
        ...userData,
        _id: new mongoose.Types.ObjectId(userData.sub.replace(/^auth0\|/i, '')),
        role: "user",
      })
        .then((user) => {
          res.status(200).json({
            success: true,
            message: "first login!",
            user,
          });
        })
        .catch((err) => {
          console.error(err);
        });
  },
  getAll: async function (req, res) {
    let users = await User.find({ role: "user" });
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      users: users,
    });
  },
  getInfo: async function (req, res) {
    let token = req.headers["x-access-token"];
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
      const { id } = decoded;
      User.findById(id).then(async (user) => {
        if (!user) {
          return res.status(404).json({
            success: false,
            error: { user: "user not found" },
          });
        }
        res.status(200).json({
          success: true,
          data: user,
        });
      });
    });
  },
};
