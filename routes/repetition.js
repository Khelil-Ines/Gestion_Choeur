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

/**
 * @swagger
 * /repetition/add:
 *   post:
 *     summary: Ajoute une nouvelle répétition (réservé au chef de pupitre)
 *     tags:
 *       - Répétition
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repetition'
 *     responses:
 *       '200':
 *         description: Répétition ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repetition'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 */
router.post("/add",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.addRepetition);

/**
 * @swagger
 * /repetition:
 *   get:
 *     summary: Obtient le planning des répétitions
 *     tags:
 *       - Répétition
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Succès - Récupère le planning des répétitions
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être authentifié
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.get("/",auth.loggedMiddleware,repetitionController.getPlanning)

/**
 * @swagger
 * /repetition/{id}:
 *   get:
 *     summary: Récupère une répétition par ID
 *     tags:
 *       - Répétition
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la répétition
 *     responses:
 *       '200':
 *         description: Succès - Récupère la répétition spécifiée par ID
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être authentifié
 *       '403':
 *         description: Interdit - L'utilisateur n'a pas les autorisations nécessaires
 *       '404':
 *         description: Non trouvé - La répétition avec l'ID spécifié n'a pas été trouvée
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.get("/:id",auth.loggedMiddleware ,repetitionController.fetchRepetition)

/**
 * @swagger
 * /repetition/{id}:
 *   patch:
 *     summary: Met à jour une répétition par ID (réservé au chef de pupitre)
 *     tags:
 *       - Répétition
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la répétition
 *     requestBody:
 *       description: Les détails de la répétition à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repetition'
 *     responses:
 *       '200':
 *         description: Succès - La répétition a été mise à jour avec succès
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être authentifié
 *       '403':
 *         description: Interdit - L'utilisateur n'a pas les autorisations nécessaires
 *       '404':
 *         description: Non trouvé - La répétition avec l'ID spécifié n'a pas été trouvée
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.patch("/:id",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.updateRepetition)

/**
 * @swagger
 * /repetition/{id}:
 *   delete:
 *     summary: Supprime une répétition par ID (réservé au chef de pupitre)
 *     tags:
 *       - Répétition
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la répétition
 *     responses:
 *       '200':
 *         description: Succès - La répétition a été supprimée avec succès
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être authentifié
 *       '403':
 *         description: Interdit - L'utilisateur n'a pas les autorisations nécessaires
 *       '404':
 *         description: Non trouvé - La répétition avec l'ID spécifié n'a pas été trouvée
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.delete("/:id",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.deleteRepetition)

/**
 * @swagger
 * /repetition/date:
 *   post:
 *     summary: Obtient le planning des répétitions pour une date spécifiée
 *     tags:
 *       - Répétition
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: La date spécifiée (au format YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: Succès - Récupère le planning des répétitions pour la date spécifiée
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être authentifié
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.post("/date",auth.loggedMiddleware, repetitionController.getPlanningByDate);

/**
 * @swagger
 * /repetition/ajouter/{id}:
 *   post:
 *     summary: Ajoute une nouvelle répétition avec pourcentage (réservé au chef de pupitre)
 *     tags:
 *       - Répétition
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert auquel la répétition est associée
 *     requestBody:
 *       description: Les détails de la répétition à ajouter avec pourcentage
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RepetitionAvecPourcentage'
 *     responses:
 *       '200':
 *         description: Répétition ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repetition'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 */
router.post('/ajouter/:id',auth.loggedMiddleware, auth.isChefPupitre, repetitionController.repetitionPourcentage);

module.exports = router;




