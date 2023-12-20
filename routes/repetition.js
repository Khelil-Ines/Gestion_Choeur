const express = require("express");
const router = express.Router();
const RepController = require("../controllers/repetition");
//find tout
router.post("/add", RepController.addRepetition);
module.exports = router;