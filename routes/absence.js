const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absence");

/**
 * @swagger
 * tags:
 *  name: Absence
 *  description:  API de gestion des absences
 */
router.post("/", absenceController.envoyerEmailElimination);
router.post("/nomination", absenceController.envoyerEmailNomination)
router.post('/seuil', absenceController.updateSeuilElimination)
router.patch("/declarationConcert", absenceController.declarerAbsenceConcert)
router.patch("/declarationRepetition", absenceController.declarerAbsenceRepetition)
router.get("/elimines", absenceController.getElimines);
router.get("/nomines", absenceController.getNomines);
router.get("/:id", absenceController.getAbsencesChoriste);

module.exports = router;