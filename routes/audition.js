const express = require('express');
const router = express.Router();
const planningController = require('../controllers/audition');

router.get('/name', planningController.fetchPlanningByCandidat);
router.get('/heure/:heureDeb', planningController.fetchPlanningByhour);
router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour', planningController.genererPlanning);
router.get('/date/:dateAudition', planningController.fetchPlanningByDate);
router.get('/', planningController.fetchPlanning);
router.get('/candidat/:candidatId', planningController.fetchPlanningByid);
router.post('/defaillant', planningController.genererPlanningDefaillants);






module.exports = router;
