const express = require("express");
const router = express.Router();
const Choriste = require("../models/choriste");
const choristeController = require("../controllers/choriste");

router.get("/",choristeController.getChoriste)

router.get("/:id",choristeController.fetchChoriste)

router.post("/",choristeController.addChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

//outer.patch("/:id", choristeController.updateTessiture)


  module.exports = router;