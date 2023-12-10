const express = require("express");
const router = express.Router();
const Compte = require("../models/compte");
const compteController = require("../controllers/compte");

router.post("/",compteController.creerCompteChoriste)


  module.exports = router;