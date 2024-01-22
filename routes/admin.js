const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const auth=require('../middlewares/auth');
const CIN = require("../middlewares/CIN");

/**
 * @swagger
 * /admin/addAdmin:
 *   post:
 *     summary: Ajoute un nouvel administrateur
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Les détails du nouvel administrateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       '200':
 *         description: Administrateur ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       '400':
 *         $ref: '#/components/responses/BadRequestResponse'
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être authentifié et avoir le rôle approprié
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.post("/addAdmin",CIN.validateCIN, adminController.addAdmin);

/**
 * @swagger
 * /admin/notification:
 *   get:
 *     summary: Récupère les notifications de l'administrateur
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Succès - Récupère les notifications de l'administrateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: L'ID de la notification
 *                       message:
 *                         type: string
 *                         description: Le message de la notification
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création de la notification
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être authentifié et avoir le rôle d'administrateur
 *       '404':
 *         description: Non trouvé - L'administrateur n'a pas été trouvé
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.get("/notification",auth.loggedMiddleware, auth.isAdmin, adminController.getAdminNotifications)

module.exports = router;