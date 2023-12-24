const express = require("express");
const router = express.Router();
const CompositeurController = require("../controllers/compositeur");

router.post("/add", CompositeurController.addCompositeur);
router.get("/all", CompositeurController.getAllCompositeur);

module.exports = router;
