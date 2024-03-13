const express = require("express");
const router = express.Router();

const Controller = require("../controllers/auth");
const { isAdmin } = require("../middlewares/auth");

router.get("/", isAdmin, Controller.getAll);
router.post("/updateUser", Controller.updateUser);
router.post("/educationalInfo", Controller.addEducationalInfo);
router.get("/getInfo", Controller.getInfo);

module.exports = router;
