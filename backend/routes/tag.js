const express = require("express");
const router = express.Router();
const Controller = require("../controllers/learningData/tag");

router.post("/", Controller.create);
router.get("/", Controller.getAll);
router.post("/filter", Controller.getFilter);
router.get("/:id", Controller.getById);
router.put("/:id", Controller.updateById);
router.delete("/:id", Controller.deleteById);

module.exports = router;
