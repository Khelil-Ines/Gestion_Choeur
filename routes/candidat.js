const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");
//find tout
router.get("/", CandidatController.ListerCandidats);
router.post("/add", CandidatController.addCandidat);
module.exports = router;