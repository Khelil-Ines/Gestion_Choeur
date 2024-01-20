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




/**
 * @swagger
 * /Chef_pupitre/repetition/{idRepetition}/{idChoriste}:
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

router.post("/repetition/:idRepetition/:idChoriste",auth.loggedMiddleware,auth.isChefPupitre,chef_controller.sauvegarderPresenceRepetition)


/**
 * @swagger
 * /Chef_pupitre/concert/{idConcert}/{idChoriste}:
 *   post:
 *     summary: Ajouter la présence manuelle d'un choriste à un concert
 *     tags:
 *       - Chef_de_Pupitre
 *     parameters:
 *       - in: path
 *         name: idConcert
 *         required: true
 *         description: ID of the concert.
 *         schema:
 *           type: string
 *       - in: path
 *         name: idChoriste
 *         required: true
 *         description: ID of the choriste.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               raison:
 *                 type: string
 *                 description: The reason for manual presence.
 *     responses:
 *       '200':
 *         description: Presence added successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Présence manuelle ajoutée avec succès
 *       '403':
 *         description: Access not authorized.
 *         content:
 *           application/json:
 *             example:
 *               erreur: Accès non autorisé
 *       '404':
 *         description: Concert or choriste not found.
 *         content:
 *           application/json:
 *             example:
 *               erreur: Concert non trouvé
 *       '409':
 *         description: Choriste is already present in the concert.
 *         content:
 *           application/json:
 *             example:
 *               erreur: Le choriste est déjà présent à ce concert
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               erreur: Erreur interne du serveur
 */
router.post("/concert/:idConcert/:idChoriste",auth.loggedMiddleware,auth.isChefPupitre,chef_controller.sauvegarderPresenceConcert)

router.get("/", chef_controller.get_chefs)
router.post("/add/:id", chef_controller.Ajouter_Chef_PupitreByID);

module.exports = router;










