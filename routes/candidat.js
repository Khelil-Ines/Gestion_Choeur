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

router.post("/saison", CandidatController.getCandidatsBySaison)



router.post("/add", CandidatController.addCandidat);

module.exports = router;

