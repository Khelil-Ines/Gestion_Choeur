const express = require("express");
const router = express.Router();
const presenceConcertController = require("../controllers/liste_present_concert");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *  name: Présence Concert/Répetition
 *  description:  API de gestion des absences des concerts et répétitons
 */

/**
 * @swagger
 * /presenceConcert/listeFinal/{id}:
 *   get:
 *     summary: Identifier la liste finale des choristes pour un concert
 *     tags: [Présence Concert/Répetition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indiquant que la liste des choristes disponibles a été mise à jour.
 *                 ListeChoristes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Choriste'
 *                   description: Liste finale des choristes par defaut absents.
 *       404:
 *         description: Concert non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /presenceConcert/listeFinalparpupitre/{concert}/{pupitre}:
 *   get:
 *     summary: Récupérer la liste des choristes présents pour un pupitre lors d'un concert
 *     tags: [Présence Concert/Répetition]
 *     parameters:
 *       - in: path
 *         name: concert
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert
 *       - in: path
 *         name: pupitre
 *         schema:
 *           type: string
 *         required: true
 *         description: Le pupitre pour lequel récupérer la liste des choristes présents
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indiquant que la liste des choristes présents a été récupérée.
 *                 personnes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Choriste'
 *                   description: Liste des choristes présents pour le pupitre spécifié.
 *       404:
 *         description: Concert non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /presenceConcert/modifier/Seuil/{id}:
 *   patch:
 *     summary: Modifier les paramètres de présence d'un concert
 *     tags: [Présence Concert/Répetition]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du concert à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewConcert'
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Concert'
 *       404:
 *         description: Concert non trouvé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewConcert:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Date du concert (format YYYY-MM-DD).
 *         lieu:
 *           type: string
 *           description: Lieu du concert.
 *         programme:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste d'identifiants des programmes liés au concert.
 *         liste_Presents:
 *            type: array
 *            items:
 *               type: string
 *            description: Liste des présents au concert.
 *         liste_dispo:
 *            type: array
 *            items:
 *               type: string
 *             description: Liste des choristes disponibles.
 *         seuil_présence:
 *            type: integer
 *            description: Seuil de présence pour le concert.
 *         liste_Abs:
 *            type: array
 *            items:
 *               type: string
 *            description: Liste des absents au concert.
 *         link:
 *            type: string
 *            description: Lien du concert.
 *         placements:
 *            type: object
 *            properties:
 *               soprano:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 description: Placement des choristes dans la section soprano.
 *               alto:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 description: Placement des choristes dans la section alto.
 *               tenor:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 description: Placement des choristes dans la section tenor.
 *               basse:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 description: Placement des choristes dans la section basse.
 *     Concert:
 *          allOf:
 *              - type: object
 *                properties:
 *                  _id:
 *                      type: string
 *                      description: The auto-generated id of the Oeuvre
 *              - $ref: '#/components/schemas/NewConcert'
 */

router.get(
  "/listeFinal/:id",
  auth.loggedMiddleware,
  auth.isAdmin,
  presenceConcertController.identifierListeFinal
);
router.get(
  "/listeFinalparpupitre/:concert/:pupitre",
  auth.loggedMiddleware,
  auth.isAdmin,
  presenceConcertController.getPresentParPupitre
);

router.patch(
  "/modifier/Seuil/:id",
  auth.loggedMiddleware,
  auth.isAdmin,
  presenceConcertController.modifierParamPresence
);

///////////////////////////////////////////
/**
 * @swagger
 * /presenceConcert/present/pupitre/{repetition}:
 *   get:
 *     summary: Afficher Les présents de mon pupitre pour cette répetition
 *     tags: [Présence Concert/Répetition]
 *     parameters:
 *       - in: path
 *         name: repetition
 *         schema:
 *           type: string
 *         required: true
 *         description: Répetition id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Choriste'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /presenceConcert/absent/pupitre/{repetition}:
 *   get:
 *     summary: Afficher Les absents de mon pupitre pour cette répetition
 *     tags: [Présence Concert/Répetition]
 *     parameters:
 *       - in: path
 *         name: repetition
 *         schema:
 *           type: string
 *         required: true
 *         description: Répetition id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Choriste'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /presenceConcert/present/programme/{programme}:
 *   get:
 *     summary: Afficher Les presents de mon pupitre pour ce programme
 *     tags: [Présence Concert/Répetition]
 *     parameters:
 *       - in: path
 *         name: programme
 *         schema:
 *           type: string
 *         required: true
 *         description: Programme id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Choriste'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * /presenceConcert/absent/programme/{programme}:
 *   get:
 *     summary: Afficher Les absents de mon pupitre pour ce programme
 *     tags: [Présence Concert/Répetition]
 *     parameters:
 *       - in: path
 *         name: programme
 *         schema:
 *           type: string
 *         required: true
 *         description: Programme id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Choriste'
 *       404:
 *         description: Object not found
 *       500:
 *         description: Some server error
 *
 */

router.get(
  "/present/pupitre/:repetition",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listPresentRepetitonMemePupitre
);

router.get(
  "/absent/pupitre/:repetition",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listAbsentRepetitonMemePupitre
);

router.get(
  "/present/programme/:programme",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listPresentProgrammeMemePupitre
);

router.get(
  "/absent/programme/:programme",
  auth.loggedMiddleware,
  auth.isChoriste,
  presenceConcertController.listAbsentProgrammeMemePupitre
);

module.exports = router;
