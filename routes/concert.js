
const router = require("express").Router();
const concertController = require("../controllers/concert.js");


/**
 * @swagger
 * tags:
 *  name: Concert
 *  description:  API de gestion des concerts
 */
router.post("/add", concertController.addConcert);
router.get("/", concertController.fetchConcert);
router.patch("/:id", concertController.updateConcert);
router.delete("/:id", concertController.deleteConcert);
router.post("/placement", concertController.attribuerPlacesAuxChoristesPresentAuConcert);
router.post("/add", concertController.addConcert);
router.get("/placement/:id", concertController.afficherPlacements);
//router.patch("/placement/modifier/:id", concertController.modifierPlace);

  module.exports = router;


