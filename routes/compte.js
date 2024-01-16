const express = require("express");
const router = express.Router();
const Compte = require("../models/compte");
const compteController = require("../controllers/compte");


router.patch("/eliminer_choriste/:id", compteController.EliminerChoriste)

router.get("/",compteController.getCompte)

router.get("/:id",compteController.fetchCompte)

router.post("/addcompte/:id",compteController.addCompte)

router.delete("/:id", compteController.deleteCompte)

router.post("/login",compteController.login)







  module.exports = router;