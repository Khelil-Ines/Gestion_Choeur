const router = require("express").Router();
const oeuvreController = require("../controllers/oeuvre.js");

router.post("/", oeuvreController.addOeuvre);

module.exports = router;
