const express = require("express");
const router = express.Router();
const Mail = require("../controllers/mail");

router.post("/envoyerEmailAvecExpiration", Mail.envoyerMailValidation);
router.patch("/sauvegarder/Candidat/:email", Mail.SauvgarderCandidat);
router.get("/validate/:email", Mail.verifierExpirationLien);
module.exports = router;
