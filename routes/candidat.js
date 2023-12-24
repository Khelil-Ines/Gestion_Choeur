const express = require("express");
const router = express.Router();
const Candidat = require("../models/candidat");
const candidatController = require("../controllers/candidat");

router.get("/",candidatController.getCandidat)

router.get("/:id",candidatController.fetchCandidat)

router.post("/",candidatController.addCandidat)

router.patch("/:id", candidatController.updateCandidat)

router.post("/liste", candidatController.getCandidatsByPupitre)

router.post("/saison", candidatController.getCandidatsBySaison)


  module.exports = router;