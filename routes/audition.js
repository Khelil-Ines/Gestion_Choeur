const express = require('express');
const router = express.Router();
const planningController = require('../controllers/audition');

router.get('/name', planningController.fetchPlanningByCandidat);
router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour', planningController.genererPlanning);
router.get('/', planningController.fetchPlanning);
router.get('/candidat/:candidatId', planningController.fetchPlanningByid);
router.post('/defaillant', planningController.genererPlanningDefaillants);
router.get('/fetchDateHeure', planningController.fetchPlanningByDateHeure);






module.exports = router;
