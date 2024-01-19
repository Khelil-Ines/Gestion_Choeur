const express = require("express");
const router = express.Router();
const auth=require('../middlewares/auth')
const choristeController = require("../controllers/choriste");
const CINMiddleware = require("../middlewares/CIN");


/**
 * @swagger
 * tags:
 *  name: Choriste
 *  description:  API de gestion des choristes
 */

//router.get('/totalAbsence', choristeController.getGeneralAbsenceStatus);
router.post("/presenceRep/:idRepetition/:link",auth.loggedMiddleware,choristeController.presence)


// router.get('/totalAbsence', choristeController.getGeneralAbsenceStatus);
// router.get('/totalAbsencePupitre/:pupitre', choristeController.getAbsenceStatusByPupitre);
// router.get('/totalAbsenceDate/:date', choristeController.getAbsencesByDate);
// router.get('/totalAbsenceChoriste/:choristeId', choristeController.getAbsencesByChoristeId);

// router.get('/totalAbsencePeriod/:startDate/:endDate', choristeController.getAbsenceByPeriod);
// router.get('/totalAbsenceProgramme/:ProgrammeId', choristeController.getAbsenceByProgram);
router.get('/total', choristeController.getAbsenceStatus);
// router.get('/totalAbsencePupitre/:pupitre', choristeController.getAbsenceStatusByPupitre);
router.get("/historique",auth.loggedMiddleware,choristeController.getHistoriqueActivite)
router.post("/setDispo/:idConcert",auth.loggedMiddleware,choristeController.setDispo);
router.get('/confirm-dispo/:userId/:idConcert/:uniqueToken', choristeController.confirmDispo);


router.post("/presenceConcert/:idConcert/:link",auth.loggedMiddleware,choristeController.presenceConcert)
router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);


router.get("/",choristeController.getChoriste)

router.get("/:id",choristeController.fetchChoriste)

router.post("/liste", choristeController.getChoristesByPupitre) 

router.patch("/update/:id",auth.loggedMiddleware, auth.isAdmin, choristeController.updatePupitre)


router.get("/profile/:id", choristeController.getprofilchoriste);
router.get("/statut/:id", choristeController.getstatutchoriste);
router.post("/",CINMiddleware.validateCIN , choristeController.addChoriste);


router.get("/lister/:idConcert",choristeController.Lister_choriste_toutchoeur)
router.get("/pupitre/:idConcert/:pupitre",choristeController.Lister_choriste_pupitre)


router.get("/historique",auth.loggedMiddleware,choristeController.getHistoriqueActivite)
module.exports = router;

