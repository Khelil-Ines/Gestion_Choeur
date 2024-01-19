const express = require("express");
const router = express.Router();
const presenceConcertController = require("../controllers/liste_present_concert");
const auth = require("../middlewares/auth");

router.get("/listeFinal/:id", presenceConcertController.identifierListeFinal);
router.get(
  "/listeFinalparpupitre/:concert/:pupitre",
  presenceConcertController.getPresentParPupitre
);

router.get(
  "/present/pupitre/:repetition",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listPresentRepetitonMemePupitre
);

router.get(
  "/absent/pupitre/:repetition",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listAbsentRepetitonMemePupitre
);

router.get(
  "/present/programme/:programme",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listPresentProgrammeMemePupitre
);

router.get(
  "/absent/programme/:programme",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listAbsentProgrammeMemePupitre
);

router.patch(
  "/modifier/Seuil/:id",
  presenceConcertController.modifierParamPresence
);
module.exports = router;
