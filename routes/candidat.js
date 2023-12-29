const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");

//find tout


router.get("/",CandidatController.getCandidat)

router.get("/:id",CandidatController.fetchCandidat)


router.patch("/:id", CandidatController.updateCandidat)

router.post("/liste", CandidatController.getCandidatsByPupitre)

router.post("/saison", CandidatController.getCandidatsBySaison)

router.get("/", CandidatController.ListerCandidats);

router.post("/add", CandidatController.addCandidat);

module.exports = router;

