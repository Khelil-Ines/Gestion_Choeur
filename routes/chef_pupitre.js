const express = require("express");
const router = express.Router();
const chef_controller = require('../controllers/chef_pupitre.js');
const auth=require('../middlewares/auth.js')

/**
 * @swagger
 * tags:
 *  name: Chef_de_Pupitre
 *  description:  API de gestion des chef de pupitres
 */
router.post("/sauvegarder-presence-repetition/:idRepetition/:idChoriste",auth.loggedMiddleware,chef_controller.sauvegarderPresenceRepetition)
router.post("/sauvegarder-presence-concert/:idConcert/:idChoriste",auth.loggedMiddleware,chef_controller.sauvegarderPresenceConcert)

router.post("/login", chef_controller.login);
/**
 * @swagger
 * /Chef_pupitre/:
 *   get:
 *     summary: Get all Chefs de Pupitre
 *     tags: [Chef_de_Pupitre]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               chefsPupitre:
 *                 - _id: "chef_pupitre_id_1"
 *                   pupitre: "Soprano"
 *                   statut: "Actif"
 *                   niveau: "Junior"
 *                   date_adhesion: "2023-01-01"
 *                   nbr_concerts: 0
 *                   nbr_repetitions: 0
 *                   historiqueStatut: []
 *                 - _id: "chef_pupitre_id_2"
 *                   pupitre: "Alto"
 *                   statut: "Actif"
 *                   niveau: "Senior"
 *                   date_adhesion: "2023-02-01"
 *                   nbr_concerts: 1
 *                   nbr_repetitions: 1
 *                   historiqueStatut:
 *                     - statut: "Actif"
 *                       date: "2023-02-01T12:00:00Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/", chef_controller.get_chefs)
/**
 * @swagger
 * /chef_pupitre/add/{id}:
 *   post:
 *     summary: Add a Chef de Pupitre from Choriste ID
 *     tags: [Chef_de_Pupitre]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the Choriste
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Chef de Pupitre added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Chef de Pupitre added!
 *               chefPupitre:
 *                 _id: "chef_pupitre_id"
 *                 pupitre: "Soprano"
 *                 statut: "Actif"
 *                 niveau: "Junior"
 *                 date_adhesion: "2023-01-01"
 *                 nbr_concerts: 0
 *                 nbr_repetitions: 0
 *                 historiqueStatut: []
 *       400:
 *         description: Bad request. You may need to verify your information.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Invalid data provided
 *       404:
 *         description: Choriste not found
 *         content:
 *           application/json:
 *             example:
 *               message: Choriste not found!
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.post("/add/:id", chef_controller.Ajouter_Chef_PupitreByID);

module.exports = router;


/**
 * @swagger
 * /Chef_pupitre/login:
 *   post:
 *     summary: Authenticate a chef pupitre
 *     tags:
 *       - Chef_de_Pupitre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             example:
 *               token: "your_generated_token_here"
 *       '401':
 *         description: Unauthorized - Login or password incorrect
 *         content:
 *           application/json:
 *             example:
 *               message: "Login ou mot passe incorrecte"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */



/**
 * @swagger
 * /Chef_pupitre/sauvegarder-presence-repetition/{idRepetition}/{idChoriste}:
 *   post:
 *     summary: Ajouter la présence manuelle d'un choriste à une répétition
 *     tags:
 *       - Chef_de_Pupitre
 *     parameters:
 *       - name: idRepetition
 *         in: path
 *         description: L'identifiant de la répétition
 *         required: true
 *         schema:
 *           type: string
 *       - name: idChoriste
 *         in: path
 *         description: L'identifiant du choriste
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Données pour ajouter la présence manuelle
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               raison:
 *                 type: string
 *                 description: Raison de la présence manuelle
 *     responses:
 *       '200':
 *         description: Présence manuelle ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresenceRepetitionResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 *       '403':
 *         $ref: '#/components/responses/UnauthorizedResponse'
 *       '404':
 *         $ref: '#/components/responses/NotFoundResponse'
 *       '409':
 *         $ref: '#/components/responses/ConflictResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalErrorResponse'
 */



/**
 * @swagger
 * /Chef_pupitre/sauvegarder-presence-concert/{idConcert}/{idChoriste}:
 *   post:
 *     summary: Ajouter la présence manuelle d'un choriste à un concert
 *     tags:
 *       - Chef_de_Pupitre
 *     parameters:
 *       - name: idConcert
 *         in: path
 *         description: L'identifiant du concert
 *         required: true
 *         schema:
 *           type: string
 *       - name: idChoriste
 *         in: path
 *         description: L'identifiant du choriste
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Données pour ajouter la présence manuelle
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               raison:
 *                 type: string
 *                 description: Raison de la présence manuelle
 *     responses:
 *       '200':
 *         description: Présence manuelle ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresenceConcertResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 *       '403':
 *         $ref: '#/components/responses/UnauthorizedResponse'
 *       '404':
 *         $ref: '#/components/responses/NotFoundResponse'
 *       '409':
 *         $ref: '#/components/responses/ConflictResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalErrorResponse'
 */


