const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');

/**
 * @swagger
 * tags:
 *  name: Congé
 *  description:  API de gestion des congés
 */
router.post('/:id/conges', congeController.addConge);

module.exports = router;