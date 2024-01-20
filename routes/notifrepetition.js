const express = require("express");
const router = express.Router();
const notifrepController = require("../controllers/notifrepetition");
const auth = require("../middlewares/auth");
const choriste = require("../middlewares/Choriste");

/**
 * @swagger
 * tags:
 *  name: Notification Répetition
 *  description:  API de gestion des notifications des répétitions
 */

/**
 * @swagger
 * /notifrep/rappel/{repetitions}/{heure}/{minute}/{jar}:
 *   get:
 *     summary: Afficher notification de rappel de rpetition si c'est un choriste n'est pas en congé
 *     tags: [Notification Répetition]
 *     parameters:
 *       - in: path
 *         name: repetitions
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de répétitions du rappel.
 *       - in: path
 *         name: heure
 *         schema:
 *           type: string
 *         required: true
 *         description: Heure du rappel.
 *       - in: path
 *         name: minute
 *         schema:
 *           type: string
 *         required: true
 *         description: Minute du rappel.
 *       - in: path
 *         name: jar
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de jours avant la répétition.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/rappel/:repetitions/:heure/:minute/:jar",
  auth.loggedMiddleware,
  auth.isChoriste,
  auth.isChefPupitre,
  choriste.choristeActif,
  notifrepController.envoyerNotification
);

/**
 * @swagger
 * /notifrep/changes/{rep}/{nh}/{nl}:
 *   get:
 *     summary: Afficher notification de rappel de changement de lieu et horaire
 *     tags: [Notification Répetition]
 *     parameters:
 *       - in: path
 *         name: nh
 *         schema:
 *           type: string
 *         required: true
 *         description: Nouveau horaire
 *       - in: path
 *         name: nl
 *         schema:
 *           type: string
 *         required: true
 *         description: Nouveau lieu.
 *       - in: path
 *         name: rep
 *         schema:
 *           type: string
 *         required: true
 *         description: La repetition.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.get(
  "/changes/:rep/:nh/:nl",
  auth.loggedMiddleware,
  auth.isChefPupitre,
  notifrepController.envoyerNotificationChangementRépetition
);

/**
 * @swagger
 * /notifrep/autrechanges:
 *   post:
 *     summary: Envoyer une notification de changement autre que les répétitions
 *     tags: [Notification Répetition]
 *     requestBody:
 *       description: Paramètres pour envoyer une notification de changement autre que les répétitions.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               changement:
 *                 type: string
 *                 description: Le type de changement.
 *               message:
 *                 type: string
 *                 description: Le message associé au changement.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès.
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/autrechanges",
  auth.loggedMiddleware,
  auth.isChefPupitre,
  notifrepController.envoyerNotificationChangementAutre
);

module.exports = router;
