const express = require("express");
const router = express.Router();
const validerMail = require("../controllers/validermail");

router.post("/envoyermail", validerMail.envoyerMail);
router.post("/validermail/:email", validerMail.envoyerValidationMail);
router.post(
  "/sauvegarderCandidat/:nom/:prenom/:email",
  validerMail.ValiderEtSauvgarder
);

module.exports = router;
