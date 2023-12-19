const express = require("express");
const router = express.Router();
const candidatController = require("../controllers/candidat");

//find tout
router.get("/", candidatController.ListerCandidats);


router.get("/",candidatController.getCandidat)

router.get("/:id",candidatController.fetchCandidat)

router.post("/",candidatController.addCandidat)

router.patch("/:id", candidatController.updateCandidat)

router.post("/liste", candidatController.getCandidatsByPupitre)

  module.exports = router;
