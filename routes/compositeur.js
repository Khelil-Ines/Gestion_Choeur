const express = require("express");
const router = express.Router();
const CompositeurController = require("../controllers/compositeur");

/**
 * @swagger
 * tags:
 *  name: Compositeur
 *  description:  API de gestion des compositeurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewCompositeur:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de Compositeur .
 *         prenom:
 *           type: string
 *           description: Prenom de Compositeur.
 *     Compositeur:
 *          allOf:
 *              - type: object
 *                properties:
 *                  _id:
 *                      type: string
 *                      description: The auto-generated id of the Oeuvre
 *              - $ref: '#/components/schemas/NewCompositeur'
 */

/**
 * @swagger
 * /Compositeur/add:
 *   post:
 *     summary: Ajouter un nouveau Compositeur
 *     tags: [Compositeur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewCompositeur'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Compositeur'
 *       400:
 *         description: Bad request. Verifier vos données.
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /Compositeur/all:
 *   get:
 *     summary: Afficher tous les Compositeurs
 *     tags: [Compositeur]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Compositeur'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */
router.post("/add", CompositeurController.addCompositeur);
router.get("/all", CompositeurController.getAllCompositeur);

module.exports = router;
