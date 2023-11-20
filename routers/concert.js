const router = require("express").Router();
const concertController = require("../controllers/concert.js");

router.get("/", concertController.fetchConcert);
router.post("/", concertController.addConcert);
router.patch("/:id", concertController.updateConcert);
router.delete("/:id", concertController.deleteConcert);

module.exports = router;
