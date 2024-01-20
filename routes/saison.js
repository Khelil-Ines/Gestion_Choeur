const express = require("express");
const router = express.Router();
const SaisonController = require("../controllers/saison");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *  name: Saison
 *  description:  API de gestion des saisons
 */
/**
 * @swagger
 * /saison/saisons/{saison}:
 *   get:
 *     summary: Obtenir les données de la saison spécifiée.
 *     tags: [Saison]
 *     parameters:
 *       - in: path
 *         name: saison
 *         schema:
 *           type: string
 *         required: true
 *         description: L'année de la saison (par exemple, 2023).
 *     responses:
 *       200:
 *         description: Succès. Données de la saison trouvées.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Choristes_de_saison:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Choriste'
 *                 Répétitions_de_saison:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Repetition'
 *                 Concert_de_saison:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Concert'
 *                 Candidats_de_saison:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidat'
 *                 message:
 *                   type: string
 *                   description: Un message descriptif.
 *       400:
 *         description: Requête incorrecte. Une erreur est survenue lors de la récupération des données.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Le message d'erreur détaillé.
 *                 message:
 *                   type: string
 *                   description: Un message descriptif.
 *       404:
 *         description: Aucune donnée trouvée pour la saison spécifiée.
 *       500:
 *         description: Erreur serveur.
 */
router.get(
  "/saisons/:saison",
  auth.loggedMiddleware,
  auth.isAdmin,
  SaisonController.getSaison
);

/**
 * @swagger
 * /saison/lancerAudition:
 *   post:
 *     summary: Lancer une nouvelle Candidature
 *     tags: [Saison]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewCandidature'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Candidature'
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Candidature'
 *       400:
 *         description: Bad request. You may need to verify your information.
 *       500:
 *         description: Some server error
 *
 */

router.post(
  "/lancerAudition",
  auth.loggedMiddleware,
  auth.isAdmin,
  SaisonController.lancerCandidature
);

/**
 * @swagger
 * /saison/candidature/estOuverte/{id}:
 *   get:
 *     summary: Afficher si la candidature est encore ouverte ou non
 *     tags: [Saison]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: l'id de la candidature
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Candidature'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */
router.get(
  "/candidature/estOuverte/:id",
  auth.loggedMiddleware,
  auth.isAdmin,
  SaisonController.candidatureEstOuverte
);

/**
 * @swagger
 * /saison/candidature/update/{id}:
 *     patch:
 *      summary: Mettre a jour la candidature
 *      tags: [Saison]
 *      parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: candidature id
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewCandidature'
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
 *                  $ref: '#/components/schemas/Candidature'
 *        400:
 *          description: Bad request. Check your parameters.
 *        500:
 *          description: Internal Server Error.
 */
router.patch(
  "/candidature/update/:id",
  auth.loggedMiddleware,
  auth.isAdmin,
  SaisonController.updateCandidature
);

/**
 * @swagger
 * components:
 *   schemas:
 *     NewCandidature:
 *       type: object
 *       properties:
 *         dateDebut:
 *           type: string
 *           format: date
 *           description: Date de début de la candidature.
 *         nbJours:
 *           type: integer
 *           description: Nombre de jours de la candidature.
 *     Candidature:
 *          allOf:
 *              - type: object
 *                properties:
 *                  _id:
 *                      type: string
 *                      description: The auto-generated id of the Candidature
 *              - $ref: '#/components/schemas/NewCandidature'
 */

module.exports = router;
