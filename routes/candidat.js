const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");
//find tout
router.get("/", CandidatController.ListerCandidats);

module.exports = router;