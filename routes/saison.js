const express = require("express");
const router = express.Router();
const SaisonController = require("../controllers/saison");

router.get("/saisons/:saison", SaisonController.getSaison);
router.post("/lancerAudition", SaisonController.lancerCandidature);
router.get(
  "/candidature/estOuverte/:id",
  SaisonController.candidatureEstOuverte
);
router.get("/candidature/update/:id", SaisonController.updateCandidature);

module.exports = router;
