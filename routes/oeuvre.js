const express = require("express");
const router = express.Router();
const OeuvreController = require("../controllers/oeuvre");

/**
 * @swagger
 * tags:
 *  name: Oeuvre
 *  description:  API de gestion des oeuvres
 */

/**
 * @swagger
 * /Oeuvre/add:
 *   post:
 *     summary: Ajouter un nouveau Oeuvre
 *     tags: [Oeuvre]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewOeuvre'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Oeuvre'
 *       400:
 *         description: Bad request. You may need to verify your information.
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewOeuvre:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Titre de l'œuvre.
 *         compositeur:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste d'identifiants des compositeurs.
 *         arrangeurs:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des arrangeurs.
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des genres de l'œuvre.
 *         anneeComposition:
 *           type: number
 *           description: Année de composition de l'œuvre.
 *         partition:
 *           type: string
 *           description: Nom du fichier de partition (optionnel).
 *         paroles:
 *           type: string
 *           description: Paroles de l'œuvre (optionnel).
 *         choral:
 *           type: boolean
 *           description: Indique si l'œuvre est chorale.
 *     Oeuvre:
 *          allOf:
 *              - type: object
 *                properties:
 *                  _id:
 *                      type: string
 *                      description: The auto-generated id of the Oeuvre
 *              - $ref: '#/components/schemas/NewOeuvre'
 */

/**
 * @swagger
 * /Oeuvre/all:
 *   get:
 *     summary: Afficher tous les oeuvres
 *     tags: [Oeuvre]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Oeuvre'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /Oeuvre/byID/{id}:
 *   get:
 *     summary: Afficher oeuvre by id
 *     tags: [Oeuvre]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Oeuvre id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Oeuvre'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /Oeuvre/byTitle/title/{titre}:
 *   get:
 *     summary: Afficher oeuvre by titre
 *     tags: [Oeuvre]
 *     parameters:
 *       - in: path
 *         name: titre
 *         schema:
 *           type: string
 *         required: true
 *         description: The Oeuvre titre
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Oeuvre'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /Oeuvre/byParams:
 *   get:
 *     summary: Afficher Oeuvre selon paramtres (titre + année).
 *     tags: [Oeuvre]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the oeuvre to search for.
 *       - in: query
 *         name: annee
 *         schema:
 *           type: integer
 *         description: Year of composition of the oeuvre to search for.
 *     responses:
 *       200:
 *         description: List of oeuvres matching the parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Oeuvre'
 *       400:
 *         description: Bad request. Check your parameters.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Oeuvre/update/{id}:
 *     patch:
 *      summary: Mettre a jour un Oeuvre
 *      tags: [Oeuvre]
 *      parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Oeuvre id
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewOeuvre'
 *      security:
 *          - bearerAuth: []
 *      responses:
 *        200:
 *          description: Sucess.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Oeuvre'
 *        400:
 *          description: Bad request. Check your parameters.
 *        500:
 *          description: Internal Server Error.
 */
router.post("/add", OeuvreController.addOeuvre);
router.get("/all", OeuvreController.getAllOeuvres);
router.get("/byParams", OeuvreController.getOeuvresByParams);
router.get("/byID/:id", OeuvreController.getOeuvreById);
router.get("/byTitle/title/:titre", OeuvreController.getOeuvreByTitle);
router.patch("/update/:id", OeuvreController.updateOeuvre);

module.exports = router;
