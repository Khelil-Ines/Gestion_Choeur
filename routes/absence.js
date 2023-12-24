const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absence");

router.post("/declaration/:id", absenceController.declarerAbsence)

module.exports = router;