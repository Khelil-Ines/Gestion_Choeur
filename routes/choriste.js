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

/**
 * @swagger
 * /your_route_here/getAbsenceStatus:
 *   get:
 *     summary: Get absence status based on various parameters
 *     tags: [Absence]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date for filtering absences
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date for filtering absences
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Specific date for filtering absences
 *       - in: query
 *         name: choristeId
 *         schema:
 *           type: string
 *         description: ID of the chorister for individual filtering
 *       - in: query
 *         name: pupitre
 *         schema:
 *           type: string
 *         description: Chorister's section or group
 *       - in: query
 *         name: ProgrammeId
 *         schema:
 *           type: string
 *         description: ID of the program for filtering
 *       - in: query
 *         name: dateDonne
 *         schema:
 *           type: string
 *         description: Date for filtering absences based on given date
 *       - in: query
 *         name: saison
 *         schema:
 *           type: string
 *         description: Filter absences based on the current season
 *     responses:
 *       200:
 *         description: Successful response with absence status
 *       400:
 *         description: Bad request, check the request parameters
 *       404:
 *         description: Chorister not found or other related errors
 *       500:
 *         description: Internal Server Error
 */
