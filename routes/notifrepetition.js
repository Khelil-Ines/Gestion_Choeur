const express = require("express");
const router = express.Router();
const notifrepController = require("../controllers/notifrepetition");

router.get(
  "/rappel/:repetitions",
  notifrepController.envoyerNotification
);

module.exports = router;
