const express = require("express");
const router = express.Router();
const Repetition = require("../models/repetition");
const repetitionController = require("../controllers/repetition");

router.get("/",repetitionController.getRepetition)

router.get("/:id",repetitionController.fetchRepetition)

router.post("/",repetitionController.addRepetition)

router.patch("/:id", repetitionController.updateRepetition)

router.delete("/:id", repetitionController.deleteRepetition)

//router.get("/:jour",repetitionController.getRepetitionsJour)



  module.exports = router;