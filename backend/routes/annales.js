const express = require("express");
const router = express.Router();

const Controller = require("../controllers/learningData/annales");

router.post("/getPage", Controller.getPage);
router.post("/countMultiple", Controller.countMultiple);
router.post("/filterRandomMultiple", Controller.getFilterRandomMultiple);

module.exports = router;
