const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const auth=require('../middlewares/auth')

router.post("/addAdmin", adminController.addAdmin);
router.get("/notification",auth.loggedMiddleware, auth.isAdmin, adminController.getAdminNotifications)

module.exports = router;