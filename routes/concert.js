
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
 * tags:
 *   name: Concert
 *   description: API for managing concerts
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the concert in YYYY-MM-DD format
 *         lieu:
 *           type: string
 *           description: The location of the concert
 *
 *   responses:
 *     BadRequestResponse:
 *       description: Bad request
 *       content:
 *         application/json:
 *           example:
 *             error: "Invalid concert date format. Please use YYYY-MM-DD format."
 *     InvalidDateResponse:
 *       description: Invalid concert date
 *       content:
 *         application/json:
 *           example:
 *             error: "Invalid concert date. Please choose a date greater than or equal to the current date."
 *     InternalServerErrorResponse:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           example:
 *             error: "Internal server error"
 *
 * /concert/add:
 *   post:
 *     summary: Add a new concert
 *     tags:
 *       - Concert
 *     parameters:
 *       - name: date
 *         in: query
 *         description: The date of the concert in YYYY-MM-DD format
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - name: lieu
 *         in: query
 *         description: The location of the concert
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Successfully added a new concert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concert'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerErrorResponse'
 */

router.post("/add", concertController.addConcert);
router.get("/", concertController.fetchConcert);
router.patch("/:id", concertController.updateConcert);
router.delete("/:id", concertController.deleteConcert);


/**
 * @swagger
 * /concert/statistic:
 *   get:
 *     tags:
 *       - Concert
 *     summary: Get statistics based on type and ID.
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         description: The type of statistics to retrieve (concert, choriste, or oeuvre).
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID for which statistics should be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with statistics.
 *         content:
 *           application/json:
 *             example:
 *               statistics: {}
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Les paramètres "type" et "id" sont requis.'
 *       404:
 *         description: The specified type is not supported.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Type de statistiques non pris en charge.'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Erreur interne du serveur'
 */

router.get("/statistic",auth.loggedMiddleware, auth.isAdmin, concertController.getStatistics);



router.post("/placement",auth.loggedMiddleware, auth.isAdmin, concertController.attribuerPlacesAuxChoristesPresentAuConcert);
router.get("/placement/:id",auth.loggedMiddleware, auth.isAdmin, concertController.afficherPlacements);

//router.patch("/placement/modifier/:id", concertController.modifierPlace);

  module.exports = router;





