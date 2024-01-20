const express = require("express");
const router = express.Router();
const auth=require('../middlewares/auth')
const choristeController = require("../controllers/choriste");
const CINMiddleware = require("../middlewares/CIN");


/**
 * @swagger
 * tags:
 *  name: Choriste
 *  description:  API de gestion des choristes
 */

//router.get('/totalAbsence', choristeController.getGeneralAbsenceStatus);
router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,choristeController.presence)


// router.get('/totalAbsence', choristeController.getGeneralAbsenceStatus);
// router.get('/totalAbsencePupitre/:pupitre', choristeController.getAbsenceStatusByPupitre);
// router.get('/totalAbsenceDate/:date', choristeController.getAbsencesByDate);
// router.get('/totalAbsenceChoriste/:choristeId', choristeController.getAbsencesByChoristeId);

// router.get('/totalAbsencePeriod/:startDate/:endDate', choristeController.getAbsenceByPeriod);
// router.get('/totalAbsenceProgramme/:ProgrammeId', choristeController.getAbsenceByProgram);
router.get('/total', choristeController.getAbsenceStatus);
// router.get('/totalAbsencePupitre/:pupitre', choristeController.getAbsenceStatusByPupitre);
router.get("/historique",auth.loggedMiddleware,choristeController.getHistoriqueActivite)
router.post("/setDispo/:idConcert",auth.loggedMiddleware,choristeController.setDispo);
router.get('/confirm-dispo/:userId/:idConcert/:uniqueToken', choristeController.confirmDispo);


router.post("/presenceConcert/:idConcert/:link",auth.loggedMiddleware,choristeController.presenceConcert)
router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);


router.get("/",choristeController.getChoriste)

router.get("/:id",choristeController.fetchChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

router.patch("/update/:id",auth.loggedMiddleware, auth.isAdmin, choristeController.updatePupitre)


router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);
router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);


router.get("/lister/:idConcert",choristeController.Lister_choriste_toutchoeur)
router.get("/pupitre/:idConcert/:pupitre",choristeController.Lister_choriste_pupitre)


router.get("/historique",auth.loggedMiddleware,choristeController.getHistoriqueActivite)
module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Choriste
 *   description: API de gestion des choristes
 *
 * components:
 *   schemas:
 *     Choriste:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Confirmation de l'ajout de la présence
 *
 *   parameters:
 *     - name: idRepetition
 *       in: path
 *       description: L'identifiant de la répétition
 *       required: true
 *       schema:
 *         type: string
 *     - name: link
 *       in: path
 *       description: Le lien de la répétition
 *       required: true
 *       schema:
 *         type: string
 *
 *   responses:
 *     BadRequestResponse:
 *       description: Requête incorrecte
 *       content:
 *         application/json:
 *           example:
 *             erreur: "Erreur interne du serveur"
 *     NotFoundResponse:
 *       description: Entité non trouvée
 *       content:
 *         application/json:
 *           example:
 *             erreur: "Répétition non trouvée"
 *     UnauthorizedResponse:
 *       description: Accès non autorisé
 *       content:
 *         application/json:
 *           example:
 *             erreur: "Token invalide"
 *     ConflictResponse:
 *       description: Conflit
 *       content:
 *         application/json:
 *           example:
 *             erreur: "Le choriste est déjà présent à cette répétition"
 *
 * /choriste/presenceRep/{idRepetition}/{link}:
 *   post:
 *     summary: Ajouter la présence d'un choriste à une répétition
 *     tags:
 *       - Choriste
 *     parameters:
 *       - name: idRepetition
 *         in: path
 *         description: L'identifiant de la répétition
 *         required: true
 *         schema:
 *           type: string
 *       - name: link
 *         in: path
 *         description: Le lien de la répétition
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Présence ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresenceResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 *       '404':
 *         $ref: '#/components/responses/NotFoundResponse'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedResponse'
 *       '409':
 *         $ref: '#/components/responses/ConflictResponse'
 */

/**
 * @swagger
 * /choriste/setDispo/{idConcert}:
 *   patch:
 *     summary: Indiquer la disponibilité pour un concert
 *     tags:
 *       - Choriste
 *     parameters:
 *       - in: path
 *         name: idConcert
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du concert
 *     requestBody:
 *       required: true
 *       description: Données pour indiquer la disponibilité
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               choriste:
 *                 type: string
 *                 description: ID du choriste
 *               diponiblitee:
 *                 type: boolean
 *                 description: Indique si le choriste est disponible
 *     responses:
 *       200:
 *         description: Succès - Concert mis à jour avec la disponibilité
 *       404:
 *         description: Concert ou choriste non trouvé
 *       403:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur lors de la mise à jour de la disponibilité
 */



/**
 * @swagger
 * /choriste/presenceConcert/{idConcert}/{link}:
 *   post:
 *     summary: Ajouter la présence d'un choriste à un concert
 *     tags:
 *       - Choriste
 *     parameters:
 *       - name: idConcert
 *         in: path
 *         description: L'identifiant du concert
 *         required: true
 *         schema:
 *           type: string
 *       - name: link
 *         in: path
 *         description: Le lien du concert
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Présence ajoutée avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: "Présence ajoutée avec succès"
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 *       '401':
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
 * /choriste/lister/{idConcert}:
 *   get:
 *     summary: List choristers available for the entire choir in a concert
 *     tags:
 *       - Choriste
 *     parameters:
 *       - in: path
 *         name: idConcert
 *         description: The ID of the concert
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful retrieval of choristers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChoristesToutChoeurResponse'
 *       '404':
 *         description: Concert not found
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Concert non trouvé. Vérifiez l'identifiant du concert."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Erreur interne du serveur. Veuillez réessayer plus tard."
 */



/**
 * @swagger
 * /choriste/pupitre/{idConcert}/{pupitre}:
 *   get:
 *     summary: List choristers available for a specific choir section in a concert
 *     tags:
 *       - Choriste
 *     parameters:
 *       - in: path
 *         name: idConcert
 *         description: The ID of the concert
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pupitre
 *         description: The choir section (pupitre) of choristers
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['Soprano','Alto','Basse','Tenor'] # Specify the allowed pupitres
 *     responses:
 *       '200':
 *         description: Successful retrieval of choristers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChoristesToutChoeurResponse'
 *       '404':
 *         description: Concert not found
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Concert non trouvé. Vérifiez l'identifiant du concert."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Erreur interne du serveur. Veuillez réessayer plus tard."
 */




/**
 * @swagger
 * /choriste/total:
 *   get:
 *     summary: List choristers available for a specific choir section in a concert
 *     tags:
 *       - Choriste
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date for filtering absences
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date for filtering absences
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Specific date for filtering absences
 *       - in: query
 *         name: choristeId
 *         schema:
 *           type: string
 *         description: ID of the chorister for individual filtering
 *       - in: query
 *         name: pupitre
 *         schema:
 *           type: string
 *         description: Chorister's section or group
 *       - in: query
 *         name: ProgrammeId
 *         schema:
 *           type: string
 *         description: ID of the program for filtering
 *       - in: query
 *         name: dateDonne
 *         schema:
 *           type: string
 *         description: Date for filtering absences based on given date
 *       - in: query
 *         name: saison
 *         schema:
 *           type: string
 *         description: Filter absences based on the current season
 *     responses:
 *       200:
 *         description: Successful response with absence status
 *       400:
 *         description: Bad request, check the request parameters
 *       404:
 *         description: Chorister not found or other related errors
 *       500:
 *         description: Internal Server Error
 */



