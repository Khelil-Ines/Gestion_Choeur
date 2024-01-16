const express = require("express");
const router = express.Router();
const CompositeurController = require("../controllers/compositeur");

/**
 * @swagger
 * tags:
 *  name: Compositeur
 *  description:  API de gestion des compositeurs
 */

router.post("/add", CompositeurController.addCompositeur);
router.get("/all", CompositeurController.getAllCompositeur);

module.exports = router;
