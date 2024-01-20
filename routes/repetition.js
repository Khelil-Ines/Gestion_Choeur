const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetition");
const auth=require('../middlewares/auth')


/**
 * @swagger
 * tags:
 *  name: Répétition
 *  description:  API de gestion des répétitions
 */
router.post("/add", repetitionController.addRepetition);
router.get("/",auth.loggedMiddleware,repetitionController.getPlanning)
router.get("/:id",auth.loggedMiddleware ,repetitionController.fetchRepetition)
router.patch("/:id",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.updateRepetition)
router.delete("/:id",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.deleteRepetition)
router.post("/date",auth.loggedMiddleware, repetitionController.getPlanningByDate);
router.post('/ajouter/:id',auth.loggedMiddleware, auth.isChefPupitre, repetitionController.repetitionPourcentage);

module.exports = router;




/**
 * @swagger
 * tags:
 *   name: Répétition
 *   description: API de gestion des répétitions
 *
 * components:
 *   schemas:
 *     Repetition:
 *       type: object
 *       properties:
 *         heureDebut:
 *           type: string
 *           format: time
 *           description: The start time of the repetition in HH:mm format
 *         heureFin:
 *           type: string
 *           format: time
 *           description: The end time of the repetition in HH:mm format
 *         lieu:
 *           type: string
 *           description: The location of the repetition
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the repetition in YYYY-MM-DD format
 *         link:
 *           type: string
 *           description: The generated random URL for the repetition
 *
 *   parameters:
 *     - name: heureDebut
 *       in: query
 *       description: The start time of the repetition in HH:mm format
 *       required: true
 *       schema:
 *         type: string
 *         format: time
 *     - name: heureFin
 *       in: query
 *       description: The end time of the repetition in HH:mm format
 *       required: true
 *       schema:
 *         type: string
 *         format: time
 *     - name: lieu
 *       in: query
 *       description: The location of the repetition
 *       required: true
 *       schema:
 *         type: string
 *     - name: date
 *       in: query
 *       description: The date of the repetition in YYYY-MM-DD format
 *       required: true
 *       schema:
 *         type: string
 *         format: date
 *
 *   responses:
 *     BadRequestResponse:
 *       description: Bad request
 *       content:
 *         application/json:
 *           examples:
 *             invalidTime:
 *               value:
 *                 error: "Invalid start time or end time."
 *             invalidDate:
 *               value:
 *                 error: "Invalid repetition date."
 *
 * /repetition/add:
 *   post:
 *     summary: Add a new repetition
 *     tags:
 *       - Répétition
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repetition'
 *     responses:
 *       '200':
 *         description: Successfully added a new repetition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repetition'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 */
