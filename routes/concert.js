
const router = require("express").Router();
const concertController = require("../controllers/concert.js");


//add
router.post("/add", concertController.addConcert);
router.get("/", concertController.fetchConcert);
router.patch("/:id", concertController.updateConcert);
router.delete("/:id", concertController.deleteConcert);

module.exports = router;

