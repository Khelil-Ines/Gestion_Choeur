const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");
const auth=require('../middlewares/auth.js')

/**
 * @swagger
 * tags:
 *  name: Candidat
 *  description:  API de gestion des candidats
 */




/**
 * @swagger
  * /candidat/ListerCandidat:
 *   get:
 *     summary: List candidates with optional filtering and pagination
 *     tags:
 *       - Candidat
 *     parameters:
 *       - in: query
 *         name: page
 *         description: The page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         description: The number of items per page (default is 5).
 *         schema:
 *           type: integer
 *       - in: query
 *         name: nom
 *         description: Filter candidates by last name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: prénom
 *         description: Filter candidates by first name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: CIN
 *         description: Filter candidates by CIN.
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         description: Filter candidates by email.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of candidates with pagination information.
 *         content:
 *           application/json:
 *             example:
 *               candidates: [...]
 *               pagination: {...}
 *               filters: {...}
 *       '400':
 *         description: Bad request due to invalid pagination parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: Les paramètres de pagination doivent être des valeurs positives.
 *       '404':
 *         description: No candidates match the provided filters.
 *         content:
 *           application/json:
 *             example:
 *               error: Aucun candidat ne correspond aux critères de recherche.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: Erreur lors de la récupération des candidats.
 */
router.get("/ListerCandidat",auth.loggedMiddleware, auth.isAdmin, CandidatController.ListerCandidats);

router.get("/:id",CandidatController.fetchCandidat)


router.patch("/:id", CandidatController.updateCandidat)

router.post("/liste", CandidatController.getCandidatsByPupitre)

/**
 * @swagger
 * /candidat/saison:
 *   post:
 *     summary: Obtenir les candidats par saison
 *     tags: [Candidat]
 *     requestBody:
 *       description: L'ID de la saison pour filtrer les candidats
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saisonId:
 *                 type: string
 *                 description: L'ID de la saison (ObjectID)
 *     responses:
 *       200:
 *         description: Candidats récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: L'ID du candidat
 *                   nom:
 *                     type: string
 *                     description: Le nom du candidat
 *                   prénom:
 *                     type: string
 *                     description: Le prénom du candidat
 *                   email:
 *                     type: string
 *                     description: L'email du candidat
 *                   connaissance_musicale:
 *                     type: string
 *                     description: La connaissance musicale du candidat
 *                   autres_activites:
 *                     type: boolean
 *                     description: Autres activités du candidat
 *                   Taille:
 *                     type: number
 *                     description: La taille du candidat
 *                   confirmation:
 *                     type: boolean
 *                     description: Statut de confirmation du candidat
 *                   createdAt:
 *                     type: string
 *                     description: Date de création du candidat
 *       400:
 *         description: Mauvaise requête - Données invalides
 *       500:
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */
router.post("/saison", CandidatController.getCandidatsBySaison)

/**
 * @swagger
 * /candidat/add:
 *   post:
 *     summary: Ajouter un nouveau candidat
 *     tags: [Candidat]
 *     requestBody:
 *       description: Les détails du nouveau candidat
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Le nom du candidat
 *               prénom:
 *                 type: string
 *                 description: Le prénom du candidat
 *               email:
 *                 type: string
 *                 description: L'adresse e-mail du candidat (unique)
 *               connaissance_musicale:
 *                 type: string
 *                 description: La connaissance musicale du candidat
 *               autres_activites:
 *                 type: boolean
 *                 description: Indique si le candidat a d'autres activités
 *               Taille:
 *                 type: number
 *                 description: La taille du candidat
 *     responses:
 *       201:
 *         description: Candidat ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID du candidat ajouté
 *                 nom:
 *                   type: string
 *                   description: Le nom du candidat ajouté
 *                 prénom:
 *                   type: string
 *                   description: Le prénom du candidat ajouté
 *                 email:
 *                   type: string
 *                   description: L'adresse e-mail du candidat ajouté
 *                 connaissance_musicale:
 *                   type: string
 *                   description: La connaissance musicale du candidat ajouté
 *                 autres_activites:
 *                   type: boolean
 *                   description: Indique si le candidat a d'autres activités
 *                 Taille:
 *                   type: number
 *                   description: La taille du candidat ajouté
 *                 confirmation:
 *                   type: boolean
 *                   description: Statut de confirmation du candidat (par défaut false)
 *                 createdAt:
 *                   type: string
 *                   description: Date de création du candidat ajouté
 *       400:
 *         description: Mauvaise requête - Données invalides
 *       500:
 *         description: Erreur serveur - Quelque chose s'est mal passé du côté serveur
 */

router.post("/add", CandidatController.addCandidat);

module.exports = router;

