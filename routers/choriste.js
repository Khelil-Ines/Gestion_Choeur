const express = require("express");
const router = express.Router();
const choristeController = require("../controllers/choriste");
const CINMiddleware = require("../middlewares/CIN");

router.get("/statut/:id", choristeController.getstatutchoriste);

router.get("/profile/:id", choristeController.getprofilchoriste);
router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);
module.exports = router;