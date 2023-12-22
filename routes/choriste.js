const express = require("express");
const router = express.Router();
const auth=require('../middelware/auth')
const choristeController = require("../controllers/choriste");
const CINMiddleware = require("../middlewares/CIN");

router.post("/signup",choristeController.signup)
router.post("/login",choristeController.login)
router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,choristeController.presence)
router.post("/setDispo/:idConcert",auth.loggedMiddleware,choristeController.presence);
router.get('/confirm-dispo/:userId/:idConcert/:uniqueToken', choristeController.confirmDispo);
router.post("/presenceConcert/:idConcert/:link",auth.loggedMiddleware,choristeController.presenceConcert)
router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);
// router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);
router.post("/", choristeController.addChoriste);

router.get("/",choristeController.getChoriste)

router.get("/:id",choristeController.fetchChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

router.patch("/update/:id", choristeController.updatePupitre)


router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);
// router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);


router.get("/lister/:idConcert",choristeController.Lister_choriste_toutchoeur)
router.get("/pupitre/:idConcert/:pupitre",choristeController.Lister_choriste_pupitre)
module.exports = router;

