const express = require('express');
const router = express.Router();
const planningController = require('../controllers/audition');

/**
 * @swagger
 * tags:
 *  name: Audition
 *  description:  API de gestion des auditions et du planning
 */

router.delete("/delete/:id", planningController.deleteAudition);
router.patch("/update/:id", planningController.updateAudition);
router.get("/", planningController.getAudition);
router.get("/fetch/:id", planningController.fetchAudition);
 router.post("/add", planningController.addAudition);

router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour', planningController.genererPlanning);
// router.get('/fetch', planningController.fetchPlanning);
// router.get('/fetchDateHeure', planningController.fetchPlanningByDateHeure);
// router.get('/name', planningController.fetchPlanningByCandidat);
// router.get("/candidats/:filtre", planningController.getCandidatsFiltres);
// router.post("/liste", planningController.getCandidatPupitreOrdonnes);
// router.post("/email-acceptation/:id", planningController.envoyerEmailAcceptation);
// router.use("/confirmationCandidat/:id", planningController.confirmationCandidat);
// router.get('/candidat/:candidatId', planningController.fetchPlanningByid);
// router.post('/defaillant', planningController.genererPlanningDefaillants);



module.exports = router;
