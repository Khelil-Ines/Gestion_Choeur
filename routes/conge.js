const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');

router.post('/:id/conges', congeController.addConge);

module.exports = router;