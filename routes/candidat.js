const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");

//find tout
router.get("/", candidatController.ListerCandidats);


router.get("/",candidatController.getCandidat)

router.get("/:id",candidatController.fetchCandidat)

router.post("/",candidatController.addCandidat)

router.patch("/:id", candidatController.updateCandidat)

router.post("/liste", candidatController.getCandidatsByPupitre)





router.get("/", CandidatController.ListerCandidats);
router.post("/add", CandidatController.addCandidat);
module.exports = router;
