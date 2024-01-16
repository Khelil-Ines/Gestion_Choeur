const express = require("express");
const router = express.Router();
const chef_controller = require('../controllers/chef_pupitre.js');
const auth=require('../middelware/auth')

/**
 * @swagger
 * tags:
 *  name: Chef_de_Pupitre
 *  description:  API de gestion des chef de pupitres
 */
router.post("/sauvegarder-presence-repetition/:idRepetition/:idChoriste",auth.loggedMiddleware,chef_controller.sauvegarderPresenceRepetition)
router.post("/sauvegarder-presence-concert/:idConcert/:idChoriste",auth.loggedMiddleware,chef_controller.sauvegarderPresenceConcert)

router.post("/login", chef_controller.login);
router.get("/", chef_controller.get_chefs)
router.post("/add/:id", chef_controller.Ajouter_Chef_PupitreByID);

module.exports = router;