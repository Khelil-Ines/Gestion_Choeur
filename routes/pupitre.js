const express = require("express");
const router = express.Router();
const Pupitre = require("../models/pupitre");
const pupitreController = require("../controllers/pupitre");

router.get("/",pupitreController.getPupitre)

router.get("/:id",pupitreController.fetchPupitre)

router.post("/",pupitreController.addPupitre)


  module.exports = router;