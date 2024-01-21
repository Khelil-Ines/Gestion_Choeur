const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *  name: Conge
 *  description:  API de gestion des congés
 */

/**
 * @swagger
 * /conge/addconge:
 *   post:
 *     summary: Ajouter un nouveau congé
 *     tags: [Conge]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Les détails du nouveau congé
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: La date de début du congé (au format YYYY-MM-DD)
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: La date de fin du congé (au format YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Congé ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID du congé ajouté
 *                 date_debut:
 *                   type: string
 *                   description: La date de début du congé ajouté
 *                 date_fin:
 *                   type: string
 *                   description: La date de fin du congé ajouté
 *                 createdAt:
 *                   type: string
 *                   description: La date de création du congé ajouté
 *       400:
 *         description: Mauvaise requête - Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur détaillé
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur détaillé
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 */

router.post('/addconge/:AdminId',auth.loggedMiddleware, auth.isChoriste, congeController.addConge);

module.exports = router;