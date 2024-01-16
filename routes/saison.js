const express = require("express");
const router = express.Router();
const SaisonController = require("../controllers/saison");


/**
 * @swagger
 * tags:
 *  name: Saison
 *  description:  API de gestion des saisons
 */

router.get("/saisons/:saison", SaisonController.getSaison);
router.post("/lancerAudition", SaisonController.lancerCandidature);
router.get(
  "/candidature/estOuverte/:id",
  SaisonController.candidatureEstOuverte
);
router.get("/candidature/update/:id", SaisonController.updateCandidature);

module.exports = router;
