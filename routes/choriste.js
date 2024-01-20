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











router.get("/",choristeController.getChoriste)

router.get("/:id",choristeController.fetchChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

router.patch("/update/:id",auth.loggedMiddleware, auth.isAdmin, choristeController.updatePupitre)

/**
 * @swagger
 * /choriste/profile/{id}:
 *   get:
 *     summary: Get choriste profile by ID
 *     tags: [Choriste]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Choriste ID
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the choriste to fetch
 *     responses:
 *       200:
 *         description: Successful response with chorister profile
 *         content:
 *           application/json:
 *             example:
 *               message: Chorister profile retrieved successfully
 *               chorister:
 *                 _id: "chorister_id"
 *                 pupitre: "Soprano"
 *                 statut: "Actif"
 *                 niveau: "Junior"
 *                 Taille: 170
 *                 date_adhesion: "2023-01-01T00:00:00Z"
 *                 nbr_concerts: 5
 *                 nbr_repetitions: 10
 *                 nbr_absences: 2
 *       404:
 *         description: Chorister not found
 *         content:
 *           application/json:
 *             example:
 *               error: Chorister not found
 *               message: Chorister with specified ID not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/profile/:id", choristeController.getprofilchoriste);

/**
 * @swagger
 * /choriste/statut/{id}:
 *   get:
 *     summary: Get chorister status by ID
 *     tags: [Choriste]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Chorister ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with chorister status
 *         content:
 *           application/json:
 *             example:
 *               message: Chorister status retrieved successfully
 *               chorister:
 *                 _id: "chorister_id"
 *                 statut: "Actif"
 *                 historiqueStatut:
 *                   - statut: "Actif"
 *                     date: "2023-01-01T00:00:00Z"
 *                   - statut: "En_Congé"
 *                     date: "2023-02-01T00:00:00Z"
 *       404:
 *         description: Chorister not found
 *         content:
 *           application/json:
 *             example:
 *               error: Chorister not found
 *               message: Chorister with specified ID not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/statut/:id", choristeController.getstatutchoriste);

/**
 * @swagger
 * /choriste/:
 *   post:
 *     summary: Add a new chorister
 *     tags: [Choriste]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewChorister'
 *     responses:
 *       201:
 *         description: Chorister added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Chorister added!
 *               chorister:
 *                 _id: "new_chorister_id"
 *                 nom: "ines"
 *                 prénom: "khelil"
 *                 CIN: "22222262"
 *                 Taille: 160
 *                 email: "inesk093@gmail.com"
 *                 pupitre: "Tenor"
 *                 statut: "Actif"
 *                 date_adhesion: "2018"
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
 *     NewChorister:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         prénom:
 *           type: string
 *         CIN:
 *           type: number
 *         Taille:
 *           type: number
 *         email:
 *           type: string
 *         pupitre:
 *           type: string
 *           enum: [Soprano, Alto, Basse, Tenor]
 *         statut:
 *           type: string
 *           enum: [Actif, En_Congé, Eliminé]
 *         date_adhesion:
 *           type: string
 *           format: date
 *       required:
 *         - nom
 *         - prénom
 *         - CIN
 *         - Taille
 *         - email
 *         - pupitre
 *         - statut
 *         - date_adhesion
 */


router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);






router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,auth.isChoriste,choristeController.presence)




/**
 * @swagger
 * /choriste/setDispo/{idConcert}:
 *   post:
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

router.post("/setDispo/:idConcert",auth.loggedMiddleware,auth.isChoriste,choristeController.setDispo);
router.get('/confirm-dispo/:userId/:idConcert/:uniqueToken', choristeController.confirmDispo);



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

router.post("/presenceConcert/:idConcert/:link",auth.loggedMiddleware,auth.isChoriste,choristeController.presenceConcert)



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

router.get("/lister/:idConcert",auth.loggedMiddleware,auth.isAdmin,choristeController.Lister_choriste_toutchoeur)



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

router.get("/pupitre/:idConcert/:pupitre",auth.loggedMiddleware,auth.isAdmin,choristeController.Lister_choriste_pupitre)



/**
 * @swagger
 * /choriste/historique:
 *   get:
 *     summary: Get the activity history of a choriste.
 *     description: Retrieve the number of rehearsals, concerts, and details of concerts participated in by a choriste.
 *     tags:
 *       - Choriste
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the choriste's activity history.
 *         content:
 *           application/json:
 *             example:
 *               historique:
 *                 nbr_repetitions: 10
 *                 nbr_concerts: 5
 *                 concerts_participes:
 *                   - date: 2024-02-01
 *                     lieu: Concert Hall
 *                     programme:
 *                       titre: Concert Program 1
 *                       oeuvres:
 *                         - titre: Oeuvre 1
 *                         - titre: Oeuvre 2
 *                   - date: 2024-03-15
 *                     lieu: Opera House
 *                     programme:
 *                       titre: Concert Program 2
 *                       oeuvres:
 *                         - titre: Oeuvre 3
 */
router.get("/historique",auth.loggedMiddleware,auth.isChoriste,choristeController.getHistoriqueActivite)


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

router.get('/total',auth.loggedMiddleware,auth.isAdmin, choristeController.getAbsenceStatus);











router.get("/:id",choristeController.fetchChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

router.patch("/update/:id",auth.loggedMiddleware, auth.isAdmin, choristeController.updatePupitre)



router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);








module.exports = router;


















