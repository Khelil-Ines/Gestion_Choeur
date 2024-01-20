const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absence");
const auth = require('../middlewares/auth');


/**
 * @swagger
 * tags:
 *  name: Absence
 *  description:  API de gestion des absences
 */

router.post("/", absenceController.envoyerEmailElimination);
router.post("/nomination", absenceController.envoyerEmailNomination)
router.post('/seuil', absenceController.updateSeuilElimination)
router.patch("/declarationConcert", absenceController.declarerAbsenceConcert)
router.patch("/declarationRepetition", absenceController.declarerAbsenceRepetition)
router.get("/elimines", absenceController.getElimines);
router.get("/nomines", absenceController.getNomines);
router.get("/:id", absenceController.getAbsencesChoriste);

/**
 * @swagger
 * path:
 *   /api/addAbsence:
 *     post:
 *       summary: Ajoute une nouvelle absence pour un choriste
 *       tags: [Absences]
 *       security:
 *         - bearerAuth: []  # Utilisez ce tag si l'authentification est nécessaire
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Type:
 *                   type: string
 *                   enum: ['Repetition', 'Concert']
 *                   description: Type d'absence (Repetition ou Concert)
 *                   example: Repetition
 *                 raison:
 *                   type: string
 *                   description: Raison de l'absence (facultatif)
 *                   example: Maladie
 *                 Date:
 *                   type: string
 *                   format: date
 *                   description: Date de l'absence (au format AAAA-MM-JJ)
 *                   example: 2024-01-20
 *       responses:
 *         '200':
 *           description: Absence ajoutée avec succès
 *         '401':
 *           description: Non autorisé, l'utilisateur doit être connecté et être un choriste
 *         '500':
 *           description: Erreur interne du serveur
 */
router.post("/addAbsence",auth.loggedMiddleware, auth.isChoriste, absenceController.addAbsence);


module.exports = router;