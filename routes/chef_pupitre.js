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

router.post("/repetition/:idRepetition/:idChoriste",auth.loggedMiddleware,chef_controller.sauvegarderPresenceRepetition)



router.post("/concert/:idConcert/:idChoriste",auth.loggedMiddleware,chef_controller.sauvegarderPresenceConcert)

router.get("/", chef_controller.get_chefs)
router.post("/add/:id", chef_controller.Ajouter_Chef_PupitreByID);

module.exports = router;










