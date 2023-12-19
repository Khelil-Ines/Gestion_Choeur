const express = require("express");
const router = express.Router();
const Repetition = require("../models/repetition");
const repetitionController = require("../controllers/repetition");

router.get("/",repetitionController.getPlanning)

router.get("/:id",repetitionController.fetchRepetition)

router.post("/",repetitionController.addRepetition)

router.patch("/:id", repetitionController.updateRepetition)

router.delete("/:id", repetitionController.deleteRepetition)

router.post("/date", repetitionController.getPlanningByDate);

  module.exports = router;