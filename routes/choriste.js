const express = require("express");
const router = express.Router();
const choristeController = require("../controllers/choriste");
const CINMiddleware = require("../middlewares/CIN");



router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);
router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);

router.get("/",choristeController.getChoriste)

router.get("/:id",choristeController.fetchChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

router.patch("/update/:id", choristeController.updatePupitre)


  module.exports = router;
