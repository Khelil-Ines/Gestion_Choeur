const router = require("express").Router();
const multer = require("multer");
const programmeController = require("../controllers/programme.js");
const upload = multer({ storage: multer.memoryStorage() }); 



router.get("/", programmeController.getProgrammes);
router.post("/", programmeController.addProgramme);

router.post('/ajouterProgrammeFile', upload.single('fichierExcel'), programmeController.addProgrammewithFile);
   
  


module.exports = router;
