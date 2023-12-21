const express = require("express");
const router = express.Router();
const auth=require('../middelware/auth')
const UserController = require("../controllers/choriste");

router.post("/signup",UserController.signup)
router.post("/login",UserController.login)
router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,UserController.presence)
router.post("/presenceConcert/:idConcert/:link",auth.loggedMiddleware,UserController.presenceConcert)
module.exports = router;