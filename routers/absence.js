const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absence");

router.post("/", absenceController.envoyerEmailElimination);
router.post("/nomination", absenceController.envoyerEmailNomination)
router.post("/declaration/:id", absenceController.declarerAbsence)
router.get("/:id", absenceController.getAbsencesChoriste);
module.exports = router;