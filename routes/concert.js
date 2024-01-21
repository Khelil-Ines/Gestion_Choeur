
const router = require("express").Router();
const concertController = require("../controllers/concert.js");
const auth=require('../middlewares/auth')


/**
 * @swagger
 * tags:
 *  name: Concert
 *  description:  API de gestion des concerts
 */

/**
 * @swagger
 * /concert/add:
 *   post:
 *     summary: Add a new concert
 *     tags:
 *       - Concert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       201:
 *         description: Concert added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Concert added!
 *               concert:
 *                 _id: "concert_id"
 *                 date: "2023-08-03T00:00:00Z"
 *                 lieu: "Concert Venue 3"
 *                 programme: "id_programme_1"
 *                 liste_Presents: []
 *                 liste_dispo: []
 *                 seuil_présence: 0
 *                 liste_Abs: []
 *                 placements:
 *                   soprano: []
 *                   alto: []
 *                   tenor: []
 *                   basse: []
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
 *     Concert:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         lieu:
 *           type: string
 *         programme:
 *           type: string
 *           description: The ID of the programme associated with the concert
 *         liste_Presents:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *         liste_dispo:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *         seuil_présence:
 *           type: number
 *           default: 0
 *         liste_Abs:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *         placements:
 *           type: object
 *           properties:
 *             soprano:
 *               type: array
 *               items:
 *                 type: object
 *             alto:
 *               type: array
 *               items:
 *                 type: object
 *             tenor:
 *               type: array
 *               items:
 *                 type: object
 *             basse:
 *               type: array
 *               items:
 *                 type: object
 */

router.post("/add", concertController.addConcert);

/**
 * @swagger
 * /concert:
 *   get:
 *     summary: Get a list of concerts
 *     tags: [Concert]
 *     responses:
 *       200:
 *         description: Successful response with a list of concerts
 *         content:
 *           application/json:
 *             example:
 *               concerts:
 *                 - _id: "concert_id_1"
 *                   date: "2023-01-01T00:00:00Z"
 *                   lieu: "Concert Venue 1"
 *                   programme: ["programme_id_1", "programme_id_2"]
 *                   liste_Presents: ["participant_id_1", "participant_id_2"]
 *                   liste_dispo: ["participant_id_3", "participant_id_4"]
 *                   seuil_présence: 10
 *                   liste_Abs: ["participant_id_5", "participant_id_6"]
 *                   link: "https://example.com/concert_1"
 *                   placements: { soprano: [[Object]], alto: [[Object]], tenor: [[Object]], basse: [[Object]] }
 *                 - _id: "concert_id_2"
 *                   date: "2023-01-02T00:00:00Z"
 *                   lieu: "Concert Venue 2"
 *                   programme: ["programme_id_3", "programme_id_4"]
 *                   liste_Presents: ["participant_id_7", "participant_id_8"]
 *                   liste_dispo: ["participant_id_9", "participant_id_10"]
 *                   seuil_présence: 15
 *                   liste_Abs: ["participant_id_11", "participant_id_12"]
 *                   link: "https://example.com/concert_2"
 *                   placements: { soprano: [[Object]], alto: [[Object]], tenor: [[Object]], basse: [[Object]] }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/", concertController.fetchConcert);

/**
 * @swagger
 * /concert/{id}:
 *   patch:
 *     summary: Update a concert by ID
 *     tags: [Concert]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the concert to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateConcert'
 *     responses:
 *       200:
 *         description: Concert updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Concert updated!
 *               updatedConcert:
 *                 _id: "concert_id"
 *                 date: "2023-01-03T00:00:00Z"
 *                 lieu: "Updated Concert Venue"
 *                 programme: ["updated_programme_id_1", "updated_programme_id_2"]
 *                 liste_Presents: ["updated_participant_id_1", "updated_participant_id_2"]
 *                 liste_dispo: ["updated_participant_id_3", "updated_participant_id_4"]
 *                 seuil_présence: 30
 *                 liste_Abs: ["updated_participant_id_5", "updated_participant_id_6"]
 *                 link: "https://example.com/updated_concert"
 *                 placements: { soprano: [[Object]], alto: [[Object]], tenor: [[Object]], basse: [[Object]] }
 *       400:
 *         description: Bad request. You may need to verify your information.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Invalid data provided
 *       404:
 *         description: Concert not found
 *         content:
 *           application/json:
 *             example:
 *               message: Concert not found
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
 *     UpdateConcert:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         lieu:
 *           type: string
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *         liste_Presents:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *         liste_dispo:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *         seuil_présence:
 *           type: number
 *           default: 0
 *         liste_Abs:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *         link:
 *           type: string
 *         placements:
 *           type: object
 */

router.patch("/:id", concertController.updateConcert);

/**
 * @swagger
 * /concert/{id}:
 *   delete:
 *     summary: Delete a concert by ID
 *     tags: [Concert]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the concert to delete
 *     responses:
 *       200:
 *         description: Concert deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Concert deleted!
 *       404:
 *         description: Concert not found
 *         content:
 *           application/json:
 *             example:
 *               message: Concert not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.delete("/:id", concertController.deleteConcert);

/**
 * @swagger
 * /concert/placement:
 *   post:
 *     summary: Attribue des places aux choristes présents pour un concert
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: L'ID du concert pour lequel attribuer les places
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               concertId:
 *                 type: string
 *                 description: L'ID du concert
 *                 example: 61778c1c86f3a456ea77aa04
 *     responses:
 *       '200':
 *         description: Places attribuées avec succès aux choristes présents
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être connecté et être un administrateur
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.post("/placement",auth.loggedMiddleware, auth.isAdmin, concertController.attribuerPlacesAuxChoristesPresentAuConcert);

/**
 * @swagger
 * /concert/placement/{id}:
 *   get:
 *     summary: Affiche les placements des choristes pour un concert
 *     tags: [Concert]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     responses:
 *       '200':
 *         description: Placements du concert affichés avec succès
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être connecté et être un administrateur
 *       '404':
 *         description: Non trouvé - Le concert avec l'ID spécifié n'a pas été trouvé
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.get("/placement/:id",auth.loggedMiddleware, auth.isAdmin, concertController.afficherPlacements);

  module.exports = router;






