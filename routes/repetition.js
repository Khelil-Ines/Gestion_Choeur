const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetition");


/**
 * @swagger
 * tags:
 *  name: Répétition
 *  description:  API de gestion des répétitions
 */
router.post("/add", repetitionController.addRepetition);
router.get("/",repetitionController.getPlanning)
router.get("/:id",repetitionController.fetchRepetition)
router.patch("/:id", repetitionController.updateRepetition)
router.delete("/:id", repetitionController.deleteRepetition)
router.post("/date", repetitionController.getPlanningByDate);
router.post('/ajouter', repetitionController.repetitionPourcentage);

module.exports = router;
