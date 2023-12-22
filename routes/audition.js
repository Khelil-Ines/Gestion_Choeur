const express = require('express');
const router = express.Router();
const planningController = require('../controllers/audition');


router.delete("/:id", planningController.deleteAudition);
router.patch("/:id", planningController.updateAudition);
router.get("/", planningController.getAudition);
router.get("/:id", planningController.fetchAudition);
router.post("/", planningController.addAudition);
router.get("/candidats/:filtre", planningController.getCandidatsFiltres);
router.post("/liste", planningController.getCandidatPupitreOrdonnes);
router.post("/email-acceptation/:id", planningController.envoyerEmailAcceptation);
router.use("/confirmationCandidat/:id", planningController.confirmationCandidat);
router.get('/name', planningController.fetchPlanningByCandidat);
router.get('/heure/:heureDeb', planningController.fetchPlanningByhour);
router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour', planningController.genererPlanning);
router.get('/date/:dateAudition', planningController.fetchPlanningByDate);
router.get('/fetch', planningController.fetchPlanning);
router.get('/candidat/:candidatId', planningController.fetchPlanningByid);
router.post('/defaillant', planningController.genererPlanningDefaillants);


module.exports = router;
