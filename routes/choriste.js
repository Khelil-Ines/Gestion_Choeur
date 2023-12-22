const express = require("express");
const router = express.Router();
const auth=require('../middelware/auth')
const choristeController = require("../controllers/choriste");
const CINMiddleware = require("../middlewares/CIN");


router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);
// router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);
router.post("/", choristeController.addChoriste);

router.get("/",choristeController.getChoriste)

router.get("/:id",choristeController.fetchChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

router.patch("/update/:id", choristeController.updatePupitre)

router.post("/signup",choristeController.signup)
router.post("/login",choristeController.login)
router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,choristeController.presence)
router.post("/presenceConcert/:idConcert/:link",auth.loggedMiddleware,choristeController.presenceConcert)
module.exports = router;

