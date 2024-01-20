const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *  name: Congé
 *  description:  API de gestion des congés
 */

router.post('/addconge',auth.loggedMiddleware, auth.isChoriste, congeController.addConge);
// router.post('/getNotif',auth.loggedMiddleware, auth.isAdmin, congeController.notifConge);
module.exports = router;