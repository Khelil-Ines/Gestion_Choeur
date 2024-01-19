const express = require("express");
const router = express.Router();
const repetitionController = require("../controllers/repetition");
const auth=require('../middlewares/auth')


/**
 * @swagger
 * tags:
 *  name: Répétition
 *  description:  API de gestion des répétitions
 */
router.post("/add",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.addRepetition);
router.get("/",auth.loggedMiddleware,repetitionController.getPlanning)
router.get("/:id",auth.loggedMiddleware ,repetitionController.fetchRepetition)
router.patch("/:id",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.updateRepetition)
router.delete("/:id",auth.loggedMiddleware, auth.isChefPupitre, repetitionController.deleteRepetition)
router.post("/date",auth.loggedMiddleware, repetitionController.getPlanningByDate);
router.post('/ajouter',auth.loggedMiddleware, auth.isChefPupitre, repetitionController.repetitionPourcentage);

module.exports = router;
