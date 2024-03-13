const express = require("express");
const router = express.Router();
const Controller = require("../controllers/user/score");

router.post("/", Controller.checkAnswer);
router.post("/dp/", Controller.checkDp);
// router.post("/saveScore", Controller.create);
router.get("/", Controller.getAll);
router.post("/getLastAssess", Controller.getOne);
router.post("/getLastAssessForDp", Controller.getDpOne);
// router.post("/filter", Controller.getFilter);
// router.get("/:id", Controller.getById);
// router.put("/:id", Controller.updateById);
// router.delete("/:id", Controller.deleteById);

module.exports = router;
