const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer_config");
const Controller = require("../controllers/learningData/question");

router.post("/", upload.single("image"), Controller.create);
router.get("/", Controller.getAll);
router.post("/filter", Controller.getFilter);
router.post("/filterRandom", Controller.getFilterRandom);
router.post("/filterRandomMultiple", Controller.getFilterRandomMultiple);
router.post("/count", Controller.count);
router.post("/countMultiple", Controller.countMultiple);
router.post("/getPage", Controller.getPage);
router.get("/:id", Controller.getById);
router.put("/:id", upload.single("image"), Controller.updateById);
router.delete("/:id", Controller.deleteById);

module.exports = router;
