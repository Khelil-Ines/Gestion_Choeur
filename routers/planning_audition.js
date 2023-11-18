const express = require("express");
const router = express.Router();
const planning_auditionController = require("../controllers/planning_audition");


router.post("/", planning_auditionController.addPlanning); 
router.get("/", planning_auditionController.fetchplannings);
module.exports = router;