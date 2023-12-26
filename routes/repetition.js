const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetition");


//find tout
router.post("/add", repetitionController.addRepetition);
router.get("/",repetitionController.getPlanning)
router.get("/:id",repetitionController.fetchRepetition)
router.patch("/:id", repetitionController.updateRepetition)
router.delete("/:id", repetitionController.deleteRepetition)
router.post("/date", repetitionController.getPlanningByDate);

module.exports = router;

