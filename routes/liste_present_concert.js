const express = require("express");
const router = express.Router();
const presenceConcertController = require("../controllers/liste_present_concert");

router.get("/listeFinal/:id", presenceConcertController.identifierListeFinal);
module.exports = router;
