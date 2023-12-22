
const router = require("express").Router();
const concertController = require("../controllers/concert.js");

router.get("/", concertController.fetchConcert);
router.patch("/:id", concertController.updateConcert);
router.delete("/:id", concertController.deleteConcert);
//add
router.post("/add", concertController.addConcert);
module.exports = router;

