const express = require("express");
const router = express.Router();
const Compte = require("../models/compte");
const compteController = require("../controllers/compte");
const auth=require('../middlewares/auth')


/**
 * @swagger
 * tags:
 *  name: Compte
 *  description:  API de gestion des comptes
 */
router.patch("/eliminer_choriste/:id", compteController.EliminerChoriste)

router.get("/",auth.loggedMiddleware, auth.isAdmin ,compteController.getCompte)

router.get("/:id",auth.loggedMiddleware, auth.isAdmin ,compteController.fetchCompte)

router.post("/addcompte/:id",auth.loggedMiddleware, auth.isAdmin ,compteController.addCompte)

router.post("/addadmin/:id",compteController.addCompte)

router.delete("/:id",auth.loggedMiddleware, auth.isAdmin , compteController.deleteCompte)

router.post("/login",compteController.login)



  module.exports = router;