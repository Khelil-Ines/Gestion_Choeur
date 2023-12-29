const express = require("express");
const router = express.Router();
const presenceConcertController = require("../controllers/liste_present_concert");

router.get("/listeFinal/:id", presenceConcertController.identifierListeFinal);
router.get(
  "/listeFinalparpupitre/:concert/:pupitre",
  presenceConcertController.getPresentParPupitre
);

router.patch(
  "/modifier/Seuil/:id",
  presenceConcertController.modifierParamPresence
);
module.exports = router;
