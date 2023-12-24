const express = require("express");
const router = express.Router();
const SaisonController = require("../controllers/saison");

router.get("/saisons/:saison", SaisonController.getSaison);

module.exports = router;
