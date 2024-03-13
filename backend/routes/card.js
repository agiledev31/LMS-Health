const express = require("express");
const router = express.Router();
const Controller = require("../controllers/learningData/card");

router.post("/", Controller.create);
router.get("/", Controller.getAll);
router.get("/withOutContent", Controller.getAllWithOutContent);
router.post("/filter", Controller.getFilter);
router.post("/filterByItem", Controller.getFilterByItem);
router.get("/:id", Controller.getById);
router.put("/:id", Controller.updateById);
router.delete("/:id", Controller.deleteById);

module.exports = router;
