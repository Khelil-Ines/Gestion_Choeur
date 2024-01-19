const express = require("express");
const router = express.Router();
const validerMail = require("../controllers/validermail");

/**
 * @swagger
 * tags:
 *  name: ValiderMail
 *  description:  API de gestion des emails
 */

/**
 * @swagger
 * /validermail/envoyerEmailAvecExpiration:
 *   post:
 *     summary: Envoie un email de validation avec expiration
 *     tags: [ValiderMail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indiquant que l'email a été envoyé
 *                 validationLink:
 *                   type: string
 *                   description: Lien de validation inclus dans l'email
 *       500:
 *         description: Erreur lors de l'envoi de l'email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 */

/**
 * @swagger
 * /validermail/validate/{email}:
 *   get:
 *     summary: Verifier si l'email est validé ou nn
 *     tags: [ValiderMail]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email du candidat
*       - in: query
 *         name: token
 *         required: true
 *         description: Le token JWT pour la validation
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Candidat'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /validermail/sauvegarder/Candidat/{email}:
 *     patch:
 *      summary: Sauvgarder candidat
 *      tags: [ValiderMail]
 *      parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: L'email du candidat a ajouté
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewCandidat'
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
 *                  $ref: '#/components/schemas/Candidat'
 *        400:
 *          description: Bad request. Check your parameters.
 *        500:
 *          description: Internal Server Error.
 */

router.post("/envoyerEmailAvecExpiration", validerMail.envoyerMailValidation);
router.patch("/sauvegarder/Candidat/:email", validerMail.SauvgarderCandidat);
router.get("/validate/:email", validerMail.verifierExpirationLien);
module.exports = router;
