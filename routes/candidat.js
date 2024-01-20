const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");


/**
 * @swagger
 * tags:
 *  name: Candidat
 *  description:  API de gestion des candidats
 */


router.get("/get",CandidatController.getCandidat)
router.get("/ListerCandidat", CandidatController.ListerCandidats);

router.get("/:id",CandidatController.fetchCandidat)


router.patch("/:id", CandidatController.updateCandidat)

router.post("/liste", CandidatController.getCandidatsByPupitre)

router.post("/saison", CandidatController.getCandidatsBySaison)


/**
 * @swagger
 * /api/candidat/add:
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

/**
 * @swagger
 * /candidat/ListerCandidat:
 *   get:
 *     summary: List candidates with optional filtering and pagination
 *     tags:
 *       - Candidat
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination (default is 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *       - name: pageSize
 *         in: query
 *         description: Number of candidates per page (default is 5)
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *       - name: nom
 *         in: query
 *         description: Filter by last name
 *         schema:
 *           type: string
 *         required: false
 *       - name: prénom
 *         in: query
 *         description: Filter by first name
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               candidates:
 *                 - id: 1
 *                   nom: "Doe"
 *                   prénom: "John"
 *                   
 *               pagination:
 *                 currentPage: 1
 *                 pageSize: 5
 *                 totalCandidates: 10
 *                 totalPages: 2
 *               filters:
 *                 firstName: "John"
 *                 lastName: "Doe"
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Les paramètres de pagination doivent être des valeurs positives."
 *       '404':
 *         description: No candidates found
 *         content:
 *           application/json:
 *             example:
 *               error: "Aucun candidat ne correspond aux critères de recherche."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur lors de la récupération des candidats."
 */
