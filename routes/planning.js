const express = require('express');
const router = express.Router();
const planningController = require('../controllers/audition');

router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour', planningController.genererEtEnregistrerPlanning);


module.exports = router;
