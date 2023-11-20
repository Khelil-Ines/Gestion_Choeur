const router = require("express").Router();
const programmeController = require("../controllers/programme.js");

router.get("/", programmeController.getProgrammes);
router.post("/", programmeController.addProgramme);
app.post('/ajouterPrgFile', upload.single('fichierExcel'), addProgrammewithFile);

module.exports = router;
