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



/**
 * @swagger
 * /audition/generate/{startDate}/{sessionStartTime}/{sessionEndTime}/{candidatesPerHour}:
 *   post:
 *     summary: Generate schedule and send audition details to candidates
 *     tags:
 *       - Audition
 *     parameters:
 *       - name: startDate
 *         in: path
 *         description: Start date for scheduling in "YYYY-MM-DD" format
 *         required: true
 *         schema:
 *           type: string
 *       - name: sessionStartTime
 *         in: path
 *         description: Start time for each audition session in "HH:mm" format
 *         required: true
 *         schema:
 *           type: string
 *       - name: sessionEndTime
 *         in: path
 *         description: End time for each audition session in "HH:mm" format
 *         required: true
 *         schema:
 *           type: string
 *       - name: candidatesPerHour
 *         in: path
 *         description: Number of candidates to schedule per hour
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: Schedule generated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Planning généré avec succès
 *               planning: [{}]
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Erreur lors de la génération du planning
 *               error: Internal Server Error
 */


router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour', planningController.genererPlanning);

/**
 * @swagger
 * /audition/fetch:
 *   get:
 *     summary: Retrieve the audition schedule
 *     tags:
 *       - Audition
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               model: [{}, {}]
 *               message: success!
 *       '400':
 *         description: Bad request or error in extracting schedules
 *         content:
 *           application/json:
 *             example:
 *               error: Error message
 *               message: Problème d'extraction des plannings !
 */

router.get('/fetch', planningController.fetchPlanning);



/**
 * @swagger
 * /audition/fetchDateHeure:
 *   get:
 *     summary: Retrieve audition schedules based on date and time criteria
 *     tags:
 *       - Audition
 *     parameters:
 *       - name: dateAudition
 *         in: query
 *         description: Date of the audition schedule in "YYYY-MM-DD" format
 *         required: false
 *         schema:
 *           type: string
 *       - name: heureDeb
 *         in: query
 *         description: Start time of the audition schedule in "HH:mm" format
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Plannings récupérés avec succès
 *               plannings: [{}, {}]
 *       '404':
 *         description: No schedules found for the specified criteria
 *         content:
 *           application/json:
 *             example:
 *               message: Aucun planning trouvé pour les critères spécifiés.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Erreur lors de la récupération des plannings
 *               error: Error message
 */

router.get('/fetchDateHeure', planningController.fetchPlanningByDateHeure);


/**
 * @swagger
 * /audition/name:
 *   get:
 *     summary: Retrieve audition schedule for a specific candidate by name
 *     tags:
 *       - Audition
 *     parameters:
 *       - name: nom
 *         in: query
 *         description: Name of the candidate for whom to retrieve the schedule
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               planning: [{}, {}]
 *       '404':
 *         description: Candidate not found or no schedule available
 *         content:
 *           application/json:
 *             example:
 *               error: Candidat non trouvé.
 *       '400':
 *         description: Bad request or missing query parameter
 *         content:
 *           application/json:
 *             example:
 *               error: Le nom du candidat est requis en tant que paramètre de requête.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Erreur lors de la récupération des plannings
 *               message: Error message
 */

router.get('/name', planningController.fetchPlanningByCandidat);
router.post("/", planningController.addAudition);
router.delete("/:id", planningController.deleteAudition);
router.patch("/:id", planningController.updateAudition);
router.get("/", planningController.getAudition);
router.get("/:id", planningController.fetchAudition);
router.get("/candidats/:filtre", planningController.getCandidatsFiltres);
router.post("/liste", planningController.getCandidatPupitreOrdonnes);
router.post("/email-acceptation/:id", planningController.envoyerEmailAcceptation);
router.use("/confirmationCandidat/:id", planningController.confirmationCandidat);



/**
 * @swagger
 * /audition/candidat/{candidatId}:
 *   get:
 *     summary: Retrieve the audition schedule for a specific candidate
 *     tags:
 *       - Audition
 *     parameters:
 *       - name: candidatId
 *         in: path
 *         description: ID of the candidate for whom to retrieve the schedule
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               model: [{}, {}]
 *               message: Success!
 *       '404':
 *         description: Candidate not found or no schedule available
 *         content:
 *           application/json:
 *             example:
 *               message: Aucun planning trouvé pour le candidat avec l'ID fourni.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Error message
 *               message: Problème d'extraction des plannings !
 */


router.get('/candidat/:candidatId', planningController.fetchPlanningByid);


/**
 * @swagger
 * /audition/defaillant:
 *   post:
 *     summary: Generate schedule and send audition details to candidates
 *     tags:
 *       - Audition
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 description: Start date for scheduling in "YYYY-MM-DD" format
 *               sessionStartTime:
 *                 type: string
 *                 description: Start time for each audition session in "HH:mm" format
 *               sessionEndTime:
 *                 type: string
 *                 description: End time for each audition session in "HH:mm" format
 *               candidatesPerHour:
 *                 type: integer
 *                 description: Number of candidates to schedule per hour
 *               candidateIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of candidate IDs
 *     responses:
 *       '201':
 *         description: Schedule generated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Planning généré avec succès
 *               planning: [{}]
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: Aucun ID de candidat fourni.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Erreur lors de la génération du planning
 *               error: Internal Server Error
 */

router.post('/defaillant', planningController.genererPlanningDefaillants);


module.exports = router;










