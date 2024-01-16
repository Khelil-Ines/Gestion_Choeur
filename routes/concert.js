
const router = require("express").Router();
const concertController = require("../controllers/concert.js");


//add
router.post("/add", concertController.addConcert);
router.get("/", concertController.fetchConcert);
router.patch("/:id", concertController.updateConcert);
router.delete("/:id", concertController.deleteConcert);
router.post("/placement", concertController.attribuerPlacesAuxChoristesPresentAuConcert);
router.post("/add", concertController.addConcert);
router.get("/placement/:id", concertController.afficherPlacements);
// router.get("/statisticConcert/:id", concertController.getStatisticConcert);
// router.get("/statisticChoriste/:id", concertController.getStatisticChoriste);
// router.get("/statisticOeuvre/:id", concertController.getStatisticsByOeuvre);
router.get("/statistic", concertController.getStatistics);


//router.patch("/placement/modifier/:id", concertController.modifierPlace);

  module.exports = router;


