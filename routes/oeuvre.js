const express = require("express");
const router = express.Router();
const OeuvreController = require("../controllers/oeuvre");

/**
 * @swagger
 * tags:
 *  name: Oeuvre
 *  description:  API de gestion des oeuvres
 */

router.post("/add", OeuvreController.addOeuvre);
router.get("/all", OeuvreController.getAllOeuvres);
router.get("/byParams", OeuvreController.getOeuvresByParams);
router.get("/byID/:id", OeuvreController.getOeuvreById);
router.get("/byTitle/title/:titre", OeuvreController.getOeuvreByTitle);
router.patch("/update/:id", OeuvreController.updateOeuvre);

module.exports = router;
