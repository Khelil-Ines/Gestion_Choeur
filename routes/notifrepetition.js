const express = require("express");
const router = express.Router();
const notifrepController = require("../controllers/notifrepetition");

router.get(
  "/rappel/:repetitions/:heure/:jar",
  notifrepController.envoyerNotification
);

module.exports = router;
