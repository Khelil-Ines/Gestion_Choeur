const express = require("express");
const router = express.Router();
const choristeController = require("../controllers/choriste");

router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);
router.post("/", choristeController.addChoriste);
module.exports = router;