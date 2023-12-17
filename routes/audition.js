const express = require("express");
const router = express.Router();
const Audition = require("../models/audition");
const auditionController = require("../controllers/audition");

router.get("/", auditionController.getAudition);

router.get("/:id", auditionController.fetchAudition);

router.post("/", auditionController.addAudition);

router.get("/candidats/:filtre", auditionController.getCandidatsFiltres);

router.post("/liste", auditionController.getCandidatPupitreOrdonnes);

router.post("/email-acceptation/:id", auditionController.envoyerEmailAcceptation);

router.use("/confirmationCandidat/:id", auditionController.confirmationCandidat);

//router.post("/email-login/:id", auditionController.envoyerEmailLogin);

module.exports = router;
