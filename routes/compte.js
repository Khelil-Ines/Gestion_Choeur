const express = require("express");
const router = express.Router();
const Compte = require("../models/compte");
const compteController = require("../controllers/compte");

router.get("/",compteController.getCompte)

router.get("/:id",compteController.fetchCompte)

router.post("/",compteController.addCompteChoriste)

  module.exports = router;