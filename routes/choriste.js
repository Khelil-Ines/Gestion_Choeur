const express = require("express");
const router = express.Router();
const auth=require('../middelware/auth')
const UserController = require("../controllers/choriste");

router.post("/signup",UserController.signup)
router.post("/login",UserController.login)
router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,UserController.presence)
router.post("/setDispo/:idConcert",auth.loggedMiddleware,UserController.setDispo)
router.get('/confirm-dispo/:userId/:idConcert/:uniqueToken', UserController.confirmDispo);

module.exports = router;