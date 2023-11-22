const express = require("express");
const router = express.Router();
const Audition = require("../models/audition");
const auditionController = require("../controllers/audition");

router.get("/", auditionController.getAudition);

router.get("/:id", auditionController.fetchAudition);

router.post("/", auditionController.addAudition);

router.get("/candidats/:filtre", auditionController.getCandidatsFiltres);

router.post("/email-acceptation/:id", auditionController.envoyerEmailAcceptation);

module.exports = router;
