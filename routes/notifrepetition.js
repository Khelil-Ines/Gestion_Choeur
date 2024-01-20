const express = require("express");
const router = express.Router();
const notifrepController = require("../controllers/notifrepetition");

/**
 * @swagger
 * tags:
 *  name: NotifRep
 *  description:  API de gestion des notifications des répétitions
 */
router.get(
  "/rappel/:repetitions/:heure/:minute/:jar",
  notifrepController.envoyerNotification
);
router.get(
  "/changes/:nh/:nl",
  notifrepController.envoyerNotificationChangementRépetition
);

router.post(
  "/autrechanges",
  notifrepController.envoyerNotificationChangementAutre
);

module.exports = router;
