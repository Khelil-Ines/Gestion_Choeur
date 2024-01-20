const express = require("express");
const router = express.Router();
const CandidatController = require("../controllers/candidat");


/**
 * @swagger
 * tags:
 *  name: Candidat
 *  description:  API de gestion des candidats
 */

// router.get("/",CandidatController.getCandidat)
router.get("/ListerCandidat", CandidatController.ListerCandidats);
router.get("/:id",CandidatController.fetchCandidat)


router.patch("/:id", CandidatController.updateCandidat)

router.post("/liste", CandidatController.getCandidatsByPupitre)

router.post("/saison", CandidatController.getCandidatsBySaison)



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
