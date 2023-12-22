const express = require("express");
const router = express.Router();
const chef_controller = require('../controllers/chef_pupitre.js');

router.get("/", chef_controller.get_chefs)
router.post("/:id", chef_controller.Ajouter_Chef_PupitreByID);

module.exports = router;