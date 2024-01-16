const express = require('express');
const router = express.Router();
const congeController = require('../controllers/conge');
const auth = require('../middelware/auth');

router.post('/addconge',auth.loggedMiddleware, auth.isChoriste, congeController.addConge);
 
module.exports = router;