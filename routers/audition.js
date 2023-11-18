const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/audition")


router.post("/", auditionController.addAuditionbyAdmin); 
router.post("/refresh", auditionController.refresh_audition);
router.get("/", auditionController.fetchAuditions);
router.delete("/:id", auditionController.deleteAudition);
router.patch("/:id", auditionController.updateAudition);
module.exports = router;