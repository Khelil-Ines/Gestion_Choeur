const express = require("express");
const router = express.Router();
const Compte = require("../models/compte");
const compteController = require("../controllers/compte");


router.patch("/eliminer_choriste/:id", compteController.EliminerChoriste)

// router.get("/",compteController.getCompte)


// router.get("/:id",compteController.fetchCompte)

// router.post("/",compteController.addCompteChoriste)


// router.delete("/:id", compteController.deleteCompte)




  module.exports = router;