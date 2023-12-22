const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");

//find tout
router.get("/", CandidatController.ListerCandidats);


router.get("/",CandidatController.getCandidat)

router.get("/:id",CandidatController.fetchCandidat)

router.post("/",CandidatController.addCandidat)

router.patch("/:id", CandidatController.updateCandidat)

router.post("/liste", CandidatController.getCandidatsByPupitre)





router.get("/", CandidatController.ListerCandidats);
router.post("/add", CandidatController.addCandidat);
module.exports = router;
