const express = require("express");
const router = express.Router();
const Controller_Item = require("../controllers/user/progress_item");
const Controller_Matiere = require("../controllers/user/progress_matiere");

router.get("/matiere/", Controller_Matiere.getAll);
router.post("/matiere/filter", Controller_Matiere.getFilter);
router.get("/item/", Controller_Item.getAll);
router.post("/item/filter", Controller_Item.getFilter);
// router.get("/matiere/:id", Controller.getById);

module.exports = router;
