const express = require("express");
const router = express.Router();
const ConcertController = require("../controllers/concert");
//find tout
router.post("/add", ConcertController.addConcert);
module.exports = router;