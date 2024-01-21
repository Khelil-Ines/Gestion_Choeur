const express = require('express');
const router = express.Router();
const planningController = require('../controllers/audition');
const auth=require('../middlewares/auth.js')
/**
 * @swagger
 * tags:
 *  name: Audition
 *  description:  API de gestion des auditions et du planning
 */

/**
 * @swagger
 * /audition/delete/{id}:
 *   delete:
 *     summary: Delete an audition by ID
 *     tags: [Audition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the audition to delete
 *     responses:
 *       200:
 *         description: Audition deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Audition deleted!
 *       404:
 *         description: Audition not found
 *         content:
 *           application/json:
 *             example:
 *               message: Audition not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */


router.delete("/delete/:id", planningController.deleteAudition);

/**
 * @swagger
 * /audition/update/{id}:
 *   patch:
 *     summary: Update an audition by ID
 *     tags: [Audition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the audition to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditionUpdate'
 *     responses:
 *       200:
 *         description: Audition updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Audition updated!
 *       400:
 *         description: Bad request. You may need to verify your information.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Invalid data provided
 *       404:
 *         description: Audition not found
 *         content:
 *           application/json:
 *             example:
 *               message: Audition not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 *
 * components:
 *   schemas:
 *     AuditionUpdate:
 *       type: object
 *       properties:
 *         résultat:
 *           type: string
 *           enum: [En Attente, Accepté, Refusé]
 *        
 */

router.patch("/update/:id", planningController.updateAudition);
/**
 * @swagger
 * /audition/:
 *   get:
 *     summary: Get a list of auditions
 *     tags: [Audition]
 *     responses:
 *       200:
 *         description: Successful response with a list of auditions
 *         content:
 *           application/json:
 *             example:
 *               auditions:
 *                 - _id: "audition_id_1"
 *                   résultat: "En Attente"
 *                   pupitre: "Basse"
 *                   Extrait_chanté: "Some excerpt"
 *                   appréciation: "A+"
 *                   remarque: "Some remark"
 *                   présence: true
 *                   candidat: "candidat_id_1"
 *                   dateAudition: "2023-01-01T00:00:00Z"
 *                   HeureDeb: "12:00 PM"
 *                   HeureFin: "1:00 PM"
 *                 - _id: "audition_id_2"
 *                   résultat: "Accepté"
 *                   pupitre: "Alto"
 *                   Extrait_chanté: "Another excerpt"
 *                   appréciation: "A"
 *                   remarque: ""
 *                   présence: false
 *                   candidat: "candidat_id_2"
 *                   dateAudition: "2023-01-02T00:00:00Z"
 *                   HeureDeb: "1:00 PM"
 *                   HeureFin: "2:00 PM"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/", planningController.getAudition);
/**
 * @swagger
 * /audition/fetch/{id}:
 *   get:
 *     summary: Get an audition by ID
 *     tags: [Audition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the audition to fetch
 *     responses:
 *       200:
 *         description: Successful response with the audition details
 *         content:
 *           application/json:
 *             example:
 *               _id: "audition_id"
 *               résultat: "En Attente"
 *               pupitre: "Basse"
 *               Extrait_chanté: "Some excerpt"
 *               appréciation: "A+"
 *               remarque: "Some remark"
 *               présence: true
 *               candidat: "candidat_id"
 *               dateAudition: "2023-01-01T00:00:00Z"
 *               HeureDeb: "12:00 PM"
 *               HeureFin: "1:00 PM"
 *       404:
 *         description: Audition not found
 *         content:
 *           application/json:
 *             example:
 *               message: Audition not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/fetch/:id", planningController.fetchAudition);
/**
 * @swagger
 * /audition/add:
 *   post:
 *     summary: Add a new audition
 *     tags: [Audition]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       201:
 *         description: Audition added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Audition added!
 *               audition:
 *                 _id: "audition_id"
 *                 résultat: "En Attente"
 *                 pupitre: "Basse"
 *                 Extrait_chanté: "Some excerpt"
 *                 appréciation: "A+"
 *                 remarque: "Some remark"
 *                 présence: true
 *                 candidat: "candidat_id"
 *                 dateAudition: "2023-01-01T00:00:00Z"
 *                 HeureDeb: "12:00 PM"
 *                 HeureFin: "1:00 PM"
 *       400:
 *         description: Bad request. You may need to verify your information.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Invalid data provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 *
 * components:
 *   schemas:
 *     Audition:
 *       type: object
 *       properties:
 *         résultat:
 *           type: string
 *           enum: [En Attente, Accepté, Refusé]
 *         pupitre:
 *           type: string
 *           enum: [Basse, Alto, Tenor, Soprano]
 *         Extrait_chanté:
 *           type: string
 *         appréciation:
 *           type: string
 *           enum: [A+, A, A-, B+, B, B-, C+, C, C-]
 *         remarque:
 *           type: string
 *         présence:
 *           type: boolean
 *         candidat:
 *           type: string
 *           description: The ID of the associated candidat
 *         dateAudition:
 *           type: string
 *           format: date-time
 *         HeureDeb:
 *           type: string
 *         HeureFin:
 *           type: string
 */

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


router.post('/generate/:startDate/:sessionStartTime/:sessionEndTime/:candidatesPerHour' , auth.loggedMiddleware, auth.isAdmin , planningController.genererPlanning);


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

router.get('/fetch', auth.loggedMiddleware, auth.isAdmin ,planningController.fetchPlanning);



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

router.get('/fetchDateHeure', auth.loggedMiddleware, auth.isAdmin ,planningController.fetchPlanningByDateHeure);


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
router.get('/name', auth.loggedMiddleware, auth.isAdmin , planningController.fetchPlanningByCandidat);

/**
 * @swagger
 * /audition:
 *   post:
 *     summary: Ajouter une nouvelle audition
 *     tags: [Audition]
 *     requestBody:
 *       description: Les détails de la nouvelle audition
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               résultat:
 *                 type: string
 *                 enum: ["En Attente", "Accepté", "Refusé"]
 *                 description: Le résultat de l'audition (En Attente, Accepté, Refusé)
 *               pupitre:
 *                 type: string
 *                 enum: ["Basse", "Alto", "Tenor", "Soprano"]
 *                 description: Le pupitre du candidat (Basse, Alto, Tenor, Soprano)
 *               Extrait_chanté:
 *                 type: string
 *                 description: L'extrait chanté par le candidat
 *               appréciation:
 *                 type: string
 *                 enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-"]
 *                 description: L'appréciation de l'audition
 *               remarque:
 *                 type: string
 *                 description: Les remarques sur l'audition (par défaut vide)
 *               présence:
 *                 type: boolean
 *                 description: La présence du candidat à l'audition (par défaut false)
 *               candidat:
 *                 type: string
 *                 description: L'ID du candidat (ObjectID)
 *               dateAudition:
 *                 type: string
 *                 format: date
 *                 description: La date de l'audition (au format YYYY-MM-DD)
 *               HeureDeb:
 *                 type: string
 *                 description: L'heure de début de l'audition (au format HH:mm)
 *               HeureFin:
 *                 type: string
 *                 description: L'heure de fin de l'audition (au format HH:mm)
 *     responses:
 *       201:
 *         description: Audition ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID de l'audition ajoutée
 *                 résultat:
 *                   type: string
 *                   description: Le résultat de l'audition ajoutée
 *                 pupitre:
 *                   type: string
 *                   description: Le pupitre du candidat ajoutée
 *                 Extrait_chanté:
 *                   type: string
 *                   description: L'extrait chanté par le candidat ajoutée
 *                 appréciation:
 *                   type: string
 *                   description: L'appréciation de l'audition ajoutée
 *                 remarque:
 *                   type: string
 *                   description: Les remarques sur l'audition ajoutée
 *                 présence:
 *                   type: boolean
 *                   description: La présence du candidat à l'audition ajoutée
 *                 candidat:
 *                   type: string
 *                   description: L'ID du candidat (ObjectID) associé à l'audition ajoutée
 *                 dateAudition:
 *                   type: string
 *                   description: La date de l'audition ajoutée
 *                 HeureDeb:
 *                   type: string
 *                   description: L'heure de début de l'audition ajoutée
 *                 HeureFin:
 *                   type: string
 *                   description: L'heure de fin de l'audition ajoutée
 *       400:
 *         description: Mauvaise requête - Données invalides
 *       500:
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.post("/", planningController.addAudition);
router.delete("/:id", planningController.deleteAudition);
router.patch("/:id", planningController.updateAudition);
router.get("/", planningController.getAudition);
router.get("/:id", planningController.fetchAudition);

/**
 * @swagger
 * /audition/liste:
 *   post:
 *     summary: Récupérer la liste des candidats par pupitre triée par résultat
 *     tags: [Audition]
 *     requestBody:
 *       description: Requête pour récupérer la liste triée par résultat
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pupitre:
 *                 type: string
 *                 description: Le pupitre pour lequel récupérer la liste
 *     responses:
 *       200:
 *         description: Succès - Liste des candidats par pupitre triée par résultat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 model:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       candidat:
 *                         $ref: '#/components/schemas/Candidat'
 *                       résultat:
 *                         type: string
 *                         description: Le résultat de l'audition (Accepté, En Attente, Refusé)
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *       400:
 *         description: Mauvaise requête - Vérifiez les paramètres de la requête
 *       500:
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.post("/liste", planningController.getCandidatPupitreOrdonnes);

/**
 * @swagger
 * /audition/email-acceptation/{id}:
 *   post:
 *     summary: Envoyer un e-mail d'acceptation au candidat
 *     tags: [Audition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID du candidat auquel envoyer l'e-mail d'acceptation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: E-mail d'acceptation envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *       404:
 *         description: Candidat non trouvé
 *       500:
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.post("/email-acceptation/:id", planningController.envoyerEmailAcceptation);

/**
 * @swagger
 * //audition/confirmationCandidat/{id}:
 *   get:
 *     summary: Confirmer la candidature et créer un compte choriste
 *     tags: [Audition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID du candidat à confirmer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidat confirmé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *       400:
 *         description: Mauvaise requête - Le candidat est déjà confirmé
 *       500:
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

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


router.get('/candidat/:candidatId',  auth.loggedMiddleware, auth.isAdmin , planningController.fetchPlanningByid);


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

router.post('/defaillant', auth.loggedMiddleware, auth.isAdmin ,  planningController.genererPlanningDefaillants);


module.exports = router;










