const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin');

router.get('/notif', AdminController.notifierAdmin);






module.exports = router;