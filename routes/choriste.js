const express = require("express");
const router = express.Router();
const auth=require('../middelware/auth')
const UserController = require("../controllers/choriste");

router.post("/signup",UserController.signup)
router.post("/login",UserController.login)
router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,UserController.presence)
router.post("/presenceConcert/:idConcert/:link",auth.loggedMiddleware,UserController.presenceConcert)
router.post("/setDispo/:idConcert",auth.loggedMiddleware,UserController.setDispo)
router.get('/confirm-dispo/:userId/:idConcert/:uniqueToken', UserController.confirmDispo);
router.get("/lister/:idConcert",UserController.Lister_choriste_toutchoeur)
router.get("/pupitre/:idConcert/:pupitre",UserController.Lister_choriste_pupitre)
module.exports = router;