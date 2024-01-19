
const router = require("express").Router();
const concertController = require("../controllers/concert.js");
const auth=require('../middlewares/auth')


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
router.post("/placement",auth.loggedMiddleware, auth.isAdmin, concertController.attribuerPlacesAuxChoristesPresentAuConcert);
router.get("/placement/:id",auth.loggedMiddleware, auth.isAdmin, concertController.afficherPlacements);
//router.patch("/placement/modifier/:id", concertController.modifierPlace);

  module.exports = router;


