const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/audition")


router.delete("/:id", auditionController.deleteAudition);
router.patch("/:id", auditionController.updateAudition);


router.get("/", auditionController.getAudition);

router.get("/:id", auditionController.fetchAudition);

router.post("/", auditionController.addAudition);

router.get("/candidats/:filtre", auditionController.getCandidatsFiltres);

router.post("/liste", auditionController.getCandidatPupitreOrdonnes);

router.post("/email-acceptation/:id", auditionController.envoyerEmailAcceptation);

router.use("/confirmationCandidat/:id", auditionController.confirmationCandidat);

module.exports = router;
