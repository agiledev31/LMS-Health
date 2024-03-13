const jwt = require("jsonwebtoken");
const User = require("../models/auth/User");

const isAdmin = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    try {
      const user = await User.findById(decoded.id);

      if (user && user.role === "admin") {
        next();
      } else {
        res
          .status(403)
          .send({ succsss: false, message: "Require Admin Role!" });
        return;
      }
    } catch (error) {
      console.error(error);
      return res
        .status(403)
        .send({ success: false, message: "User not found!" });
    }
  });
};

module.exports = {
  isAdmin,
};
