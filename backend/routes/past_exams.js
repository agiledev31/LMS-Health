const express = require("express");
const router = express.Router();
const Controller = require("../controllers/user/history");

router.post("/", Controller.create);
router.get("/:user_id", Controller.getAll);
router.put("/:id", Controller.updateById);
router.post("/saveExam", Controller.saveExam);
router.get("/savedExam/:user_id", Controller.getSavedExam);
router.delete("/savedExam/delete/:user_id", Controller.deleteSavedExams);

module.exports = router;
