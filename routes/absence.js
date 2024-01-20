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


/**
 * @swagger
 * /absence/:
 *   post:
 *     summary: Send elimination email
 *     tags: [Absence]
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: E-mail d'élimination envoyé avec succès.
 *       '404':
 *         description: No eliminated choriste found
 *         content:
 *           application/json:
 *             example:
 *               message: Aucun choriste éliminé trouvé
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Erreur lors de l'envoi de l'e-mail.
 */

router.post("/", absenceController.envoyerEmailElimination);

/**
 * @swagger
 * /absence/nomination:
 *   post:
 *     summary: Send nomination email
 *     tags: [Absence]
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: E-mail de nomination envoyé avec succès.
 *       '404':
 *         description: No nominated choriste found
 *         content:
 *           application/json:
 *             example:
 *               message: Aucun choriste nominé trouvé
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Erreur lors de l'envoi de l'e-mail.
 */

router.post("/nomination", absenceController.envoyerEmailNomination)

/**
 * @swagger
 * /absence/seuil:
 *   post:
 *     summary: Update elimination threshold
 *     tags: [Absence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nouveauSeuil:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Seuil mis à jour avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: Seuil mis à jour avec succès
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.post('/seuil', absenceController.updateSeuilElimination)

/**
 * @swagger
 * /absence/declarationConcert:
 *   patch:
 *     summary: Declare absence for concert
 *     tags: [Absence]
 *     responses:
 *       '201':
 *         description: Absences concert créées avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: Absences concert créées avec succès.
 *               choriste:
 *                 _id: "choriste_id"
 *       '404':
 *         description: No concert found or Liste_Abs is empty
 *         content:
 *           application/json:
 *             example:
 *               error: Not Found
 *               message: Aucun concert trouvé.
 *       '400':
 *         description: Liste_Abs is empty
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Liste_Abs est vide.
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.patch("/declarationConcert", absenceController.declarerAbsenceConcert)

/**
 * @swagger
 * /absence/declarationRepetition:
 *   patch:
 *     summary: Declare absence for repetition
 *     tags: [Absence]
 *     responses:
 *       '201':
 *         description: Absences repetition créées avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: Absences repetition créées avec succès.
 *               choriste:
 *                 _id: "choriste_id"
 *       '404':
 *         description: No repetition found or Liste_Abs is empty
 *         content:
 *           application/json:
 *             example:
 *               error: Not Found
 *               message: Aucune répétition trouvée.
 *       '400':
 *         description: Liste_Abs is empty
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Liste_Abs est vide.
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.patch("/declarationRepetition", absenceController.declarerAbsenceRepetition)
/**
 * @swagger
 * /absence/elimines:
 *   get:
 *     summary: Get a list of eliminated choristers
 *     tags: [Absence]
 *     responses:
 *       200:
 *         description: Successful response with a list of eliminated choristers
 *         content:
 *           application/json:
 *             example:
 *               ChoristesElimines:
 *                 - _id: "choriste_id1"
 *                   nom: "John"
 *                   prenom: "Doe"
 *                   statut: "Eliminé"
 *                 - _id: "choriste_id2"
 *                   nom: "Jane"
 *                   prenom: "Doe"
 *                   statut: "Eliminé_Dicipline"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/elimines", absenceController.getElimines);

/**
 * @swagger
 * /absence/nomines:
 *   get:
 *     summary: Get a list of nominated choristers
 *     tags: [Absence]
 *     responses:
 *       200:
 *         description: Successful response with a list of nominated choristers
 *         content:
 *           application/json:
 *             example:
 *               ChoristesNominees:
 *                 - _id: "choriste_id1"
 *                   nom: "John"
 *                   prenom: "Doe"
 *                   statut: "Nominé"
 *                 - _id: "choriste_id2"
 *                   nom: "Jane"
 *                   prenom: "Doe"
 *                   statut: "Nominé"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/nomines", absenceController.getNomines);
/**
 * @swagger
 * /absence/{id}:
 *   get:
 *     summary: Get absences for a specific chorister
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Chorister ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the absences of the chorister
 *         content:
 *           application/json:
 *             example:
 *               absences:
 *                 - _id: "absence_id1"
 *                   Type: "Repetition"
 *                   raison: "Non spécifiée"
 *                   Date: "2023-01-01T00:00:00Z"
 *                 - _id: "absence_id2"
 *                   Type: "Concert"
 *                   raison: "Non spécifiée"
 *                   Date: "2023-02-01T00:00:00Z"
 *       404:
 *         description: Chorister not found
 *         content:
 *           application/json:
 *             example:
 *               message: Chorister not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

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
/**
 * @swagger
 * /absence/discipline/{id}:
 *   post:
 *     summary: Eliminate a chorister for disciplinary reasons
 *     tags: [Absence]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the chorister to eliminate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chorister eliminated for disciplinary reasons
 *         content:
 *           application/json:
 *             example:
 *               message: Chorister Eliminé pour des raisons disciplinaires!
 *       404:
 *         description: Chorister not found
 *         content:
 *           application/json:
 *             example:
 *               message: Chorister non trouvé!
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.post("/discipline/:id", absenceController.EliminerDiscipline);
router.post("/addAbsence",auth.loggedMiddleware, auth.isChoriste, absenceController.addAbsence);


module.exports = router;