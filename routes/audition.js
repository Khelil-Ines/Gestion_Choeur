const express = require('express');
const router = express.Router();
const planningController = require('../controllers/audition');

router.post("/", planningController.addAudition);
router.delete("/:id", planningController.deleteAudition);
router.patch("/:id", planningController.updateAudition);
router.get("/", planningController.getAudition);
router.get("/:id", planningController.fetchAudition);
router.get("/candidats/:filtre", planningController.getCandidatsFiltres);
router.post("/liste", planningController.getCandidatPupitreOrdonnes);
router.post("/email-acceptation/:id", planningController.envoyerEmailAcceptation);
router.use("/confirmationCandidat/:id", planningController.confirmationCandidat);
router.get('/name', planningController.fetchPlanningByCandidat);
router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour', planningController.genererPlanning);
router.get('/', planningController.fetchPlanning);
router.get('/candidat/:candidatId', planningController.fetchPlanningByid);
router.post('/defaillant', planningController.genererPlanningDefaillants);
router.get('/fetchDateHeure', planningController.fetchPlanningByDateHeure);


module.exports = router;
