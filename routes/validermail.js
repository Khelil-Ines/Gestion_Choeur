const express = require("express");
const router = express.Router();
const validerMail = require("../controllers/validermail");

/**
 * @swagger
 * tags:
 *  name: ValidMail
 *  description:  API de gestion des emails
 */

router.post("/envoyerEmailAvecExpiration", validerMail.envoyerMailValidation);
router.patch("/sauvegarder/Candidat/:email", validerMail.SauvgarderCandidat);
router.get("/validate/:email", validerMail.verifierExpirationLien);
module.exports = router;
