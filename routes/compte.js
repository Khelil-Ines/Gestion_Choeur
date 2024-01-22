const express = require("express");
const router = express.Router();
const Compte = require("../models/compte");
const compteController = require("../controllers/compte");
const auth=require('../middlewares/auth')

router.post("/login",compteController.login)
/**
 * @swagger
 * tags:
 *  name: Compte
 *  description:  API de gestion des comptes
 */
router.patch("/eliminer_choriste/:id", compteController.EliminerChoriste)

/**
 * @swagger
 * /compte:
 *   get:
 *     summary: Récupère la liste des comptes
 *     tags: [Compte]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des comptes récupérée avec succès
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être connecté et être un administrateur
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */


router.get("/",auth.loggedMiddleware, auth.isAdmin ,compteController.getCompte)

/**
 * @swagger
 * /compte/{id}:
 *   get:
 *     summary: Récupère les détails d'un compte par ID
 *     tags: [Compte]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du compte
 *     responses:
 *       '200':
 *         description: Détails du compte récupérés avec succès
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être connecté et être un administrateur
 *       '404':
 *         description: Non trouvé - Le compte avec l'ID spécifié n'a pas été trouvé
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.get("/:id",auth.loggedMiddleware, auth.isAdmin ,compteController.fetchCompte)

/**
 * @swagger
 * /compte/addcompte/{id}:
 *   post:
 *     summary: Ajoute un compte pour un choriste
 *     tags: [Compte]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'utilisateur auquel ajouter le compte
 *     requestBody:
 *       description: Les détails du compte à ajouter
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Le nom d'utilisateur du compte
 *               motDePasse:
 *                 type: string
 *                 description: Le mot de passe du compte
 *     responses:
 *       '200':
 *         description: Compte ajouté avec succès pour l'utilisateur spécifié
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être connecté et être un administrateur
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.post("/addcompte/:id",auth.loggedMiddleware, auth.isAdmin ,compteController.addCompte)

/**
 * @swagger
 * /compte/addadmin/{id}:
 *   post:
 *     summary: Ajoute un compte administrateur
 *     tags: [Compte]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'utilisateur auquel ajouter le compte administrateur
 *     requestBody:
 *       description: Les détails du compte administrateur à ajouter
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Le nom d'utilisateur du compte administrateur
 *               motDePasse:
 *                 type: string
 *                 description: Le mot de passe du compte administrateur
 *     responses:
 *       '200':
 *         description: Compte administrateur ajouté avec succès pour l'utilisateur spécifié
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.post("/addadmin/:id",compteController.addCompte)

/**
 * @swagger
 * /compte/{id}:
 *   delete:
 *     summary: Supprime un compte par ID
 *     tags: [Compte]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du compte à supprimer
 *     responses:
 *       '200':
 *         description: Compte supprimé avec succès
 *       '401':
 *         description: Non autorisé - L'utilisateur doit être connecté et être un administrateur
 *       '404':
 *         description: Non trouvé - Le compte avec l'ID spécifié n'a pas été trouvé
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.delete("/:id",auth.loggedMiddleware, auth.isAdmin , compteController.deleteCompte)

/**
 * @swagger
 * /compte/login:
 *   post:
 *     summary: Connecte un utilisateur avec son compte
 *     tags: [Compte]
 *     requestBody:
 *       description: Les informations de connexion
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Le nom d'utilisateur
 *               motDePasse:
 *                 type: string
 *                 description: Le mot de passe
 *     responses:
 *       '200':
 *         description: Connexion réussie, renvoie un jeton d'authentification
 *       '401':
 *         description: Identifiants invalides, connexion échouée
 *       '500':
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.post("/login",compteController.login)
     

  module.exports = router;


