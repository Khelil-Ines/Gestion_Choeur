const express = require("express");
const router = express.Router();
const OeuvreController = require("../controllers/oeuvre");

router.post("/add", OeuvreController.addOeuvre);
router.get("/all", OeuvreController.getAllOeuvres);

module.exports = router;
