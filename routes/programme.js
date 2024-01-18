const router = require("express").Router();
const multer = require("multer");
const programmeController = require("../controllers/programme.js");
const upload = multer({ storage: multer.memoryStorage() }); 


/**
 * @swagger
 * tags:
 *  name: Programme
 *  description:  API de gestion des programmes
 */

router.get("/", programmeController.getProgrammes);
router.post("/add", programmeController.addProgramme);

router.post('/ajouterProgrammeFile', upload.single('fichierExcel'), programmeController.addProgrammewithFile);
   
  


module.exports = router;
